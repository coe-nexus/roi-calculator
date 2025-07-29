import React, { useState, useRef, useEffect } from "react";
import { GraphNode, GraphLink } from "../types";
import { useApiData } from "@/components/ApiProvider";

import { useDocumentModal } from '../hooks/useDocumentModal';

export const GraphView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<GraphLink[]>([]);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const draggedNodeRef = useRef<GraphNode | null>(null);
  
  // Pan and zoom state
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isPanningRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const { materials, getDoc } = useApiData();
  const { openModal } = useDocumentModal(getDoc);

  // Initialize nodes and links
  useEffect(() => {
    if (!materials) return;
    
    // Count tag occurrences
    const tagCount = new Map<string, number>();
    materials.forEach((m) => {
      m.tags.forEach((tag) => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      });
    });
    
    // Only include tags that appear in multiple materials
    const sharedTags = new Set<string>();
    tagCount.forEach((count, tag) => {
      if (count > 1) {
        sharedTags.add(tag);
      }
    });
    
    const tagMap = new Map<string, GraphNode>();
    const materialNodes: GraphNode[] = materials.map((m) => ({
      id: `material-${m.id}`,
      label: m.title,
      type: "material" as const,
      materialType: m.type,
      x: dimensions.width / 2 + (Math.random() - 0.5) * 200,
      y: dimensions.height / 2 + (Math.random() - 0.5) * 200,
      vx: 0,
      vy: 0,
      radius: 12,
      mass: 2,
    }));

    const linkData: GraphLink[] = [];
    materials.forEach((m) => {
      m.tags.forEach((tag) => {
        // Only create nodes and links for shared tags
        if (sharedTags.has(tag)) {
          if (!tagMap.has(tag)) {
            tagMap.set(tag, {
              id: `tag-${tag}`,
              label: tag,
              type: "tag" as const,
              x: dimensions.width / 2 + (Math.random() - 0.5) * 200,
              y: dimensions.height / 2 + (Math.random() - 0.5) * 200,
              vx: 0,
              vy: 0,
              radius: 8,
              mass: 1,
            });
          }
          linkData.push({
            source: `material-${m.id}`,
            target: `tag-${tag}`,
            strength: 0.1,
          });
        }
      });
    });

    nodesRef.current = [...materialNodes, ...Array.from(tagMap.values())];
    linksRef.current = linkData;
    
    // Reset simulation when data changes
    setIsSimulating(true);
    simulationStepsRef.current = 0;
  }, [materials, dimensions]);

  // Add simulation state
  const [isSimulating, setIsSimulating] = useState(true);
  const simulationStepsRef = useRef(0);

  // Simple force simulation
  const simulate = () => {
    if (!isSimulating) return;
    
    const nodes = nodesRef.current;
    const links = linksRef.current;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    let totalMovement = 0;

    nodes.forEach((node) => {
      if (draggedNodeRef.current?.id !== node.id) {
        // Center force
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        node.vx += dx * 0.0001;
        node.vy += dy * 0.0001;

        // Repulsion
        nodes.forEach((other) => {
          if (node.id !== other.id) {
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120 && dist > 0) {
              const force = 200 / (dist * dist);
              node.vx += (dx / dist) * force;
              node.vy += (dy / dist) * force;
            }
          }
        });

        // Link forces
        links.forEach((link) => {
          if (link.source === node.id || link.target === node.id) {
            const other = nodes.find(n => 
              n.id === (link.source === node.id ? link.target : link.source)
            );
            if (other) {
              const dx = other.x - node.x;
              const dy = other.y - node.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const idealDist = 80;
              if (dist > 0) {
                const force = (dist - idealDist) * 0.01;
                node.vx += (dx / dist) * force;
                node.vy += (dy / dist) * force;
              }
            }
          }
        });

        // Apply velocity with stronger damping
        node.vx *= 0.7;
        node.vy *= 0.7;
        
        // Stop tiny movements
        if (Math.abs(node.vx) < 0.01) node.vx = 0;
        if (Math.abs(node.vy) < 0.01) node.vy = 0;
        
        node.x += node.vx;
        node.y += node.vy;
        
        totalMovement += Math.abs(node.vx) + Math.abs(node.vy);
      }
    });

    // Stop simulation when movement is minimal
    simulationStepsRef.current++;
    if (totalMovement < 0.1 || simulationStepsRef.current > 300) {
      setIsSimulating(false);
    }
  };

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = dimensions.width + 'px';
    canvas.style.height = dimensions.height + 'px';
    ctx.scale(dpr, dpr);

    const render = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      ctx.save();
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.scale, transform.scale);

      simulate();

      // Draw links
      ctx.strokeStyle = "#ddd";
      ctx.lineWidth = 1;
      linksRef.current.forEach((link) => {
        const source = nodesRef.current.find((n) => n.id === link.source);
        const target = nodesRef.current.find((n) => n.id === link.target);
        if (source && target) {
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      });

      // Draw nodes
      nodesRef.current.forEach((node) => {
        const isHovered = hoveredNode?.id === node.id;
        const radius = node.type === "tag" ? 8 : 12;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = node.type === "tag" ? "#cccccc" : "#333333";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Labels
        if ((node.type === "tag" && isHovered) || (node.type === "material" && isHovered)) {
          ctx.fillStyle = "#666666";
          ctx.font = node.type === "tag" ? "10px Inter, sans-serif" : "12px Inter, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          const label = node.type === "tag" ? `#${node.label}` : node.label;
          ctx.fillText(label, node.x, node.y + radius + 5);
        }
      });

      ctx.restore();
      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions, hoveredNode, transform]);

  // Mouse interactions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const screenToWorld = (screenX: number, screenY: number) => ({
      x: (screenX - transform.x) / transform.scale,
      y: (screenY - transform.y) / transform.scale
    });

    const findNodeAt = (x: number, y: number) => {
      return nodesRef.current.find((n) => {
        const dx = x - n.x;
        const dy = y - n.y;
        const radius = n.type === "tag" ? 8 : 12;
        return Math.sqrt(dx * dx + dy * dy) < radius + 5;
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const worldPos = screenToWorld(screenX, screenY);

      if (isPanningRef.current && !draggedNodeRef.current) {
        const dx = screenX - lastMousePosRef.current.x;
        const dy = screenY - lastMousePosRef.current.y;
        setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
        lastMousePosRef.current = { x: screenX, y: screenY };
      } else if (draggedNodeRef.current) {
        draggedNodeRef.current.x = worldPos.x;
        draggedNodeRef.current.y = worldPos.y;
        draggedNodeRef.current.vx = 0;
        draggedNodeRef.current.vy = 0;
      } else {
        const node = findNodeAt(worldPos.x, worldPos.y);
        setHoveredNode(node || null);
        canvas.style.cursor = node ? "pointer" : "grab";
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const worldPos = screenToWorld(screenX, screenY);
      const node = findNodeAt(worldPos.x, worldPos.y);

      if (node) {
        draggedNodeRef.current = node;
        // Restart simulation when dragging
        setIsSimulating(true);
        simulationStepsRef.current = 0;
        if (node.type === "material") {
          openModal(parseInt(node.id.split("-")[1]));
        }
      } else {
        isPanningRef.current = true;
        lastMousePosRef.current = { x: screenX, y: screenY };
      }
    };

    const handleMouseUp = () => {
      draggedNodeRef.current = null;
      isPanningRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      
      const scaleFactor = e.deltaY < 0 ? 1.1 : 0.9;
      const newScale = Math.max(0.25, Math.min(3, transform.scale * scaleFactor));
      
      const worldX = (screenX - transform.x) / transform.scale;
      const worldY = (screenY - transform.y) / transform.scale;
      
      setTransform({
        x: screenX - worldX * newScale,
        y: screenY - worldY * newScale,
        scale: newScale
      });
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [transform, openModal]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.offsetWidth,
          height: container.offsetHeight,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative w-full h-full bg-white rounded-lg shadow overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
