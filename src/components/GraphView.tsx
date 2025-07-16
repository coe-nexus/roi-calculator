import React, { useState, useRef, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { GraphNode, GraphLink } from "../types";
import { useApiData } from "@/components/ApiProvider";

import { DocumentModal } from './DocumentModal';
import { useDocumentModal } from '../hooks/useDocumentModal';


export const GraphView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<GraphLink[]>([]);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const draggedNodeRef = useRef<GraphNode | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const { materials, getDoc } = useApiData();

  const { openedDocument, loading, error, openModal, closeModal, isOpen } = useDocumentModal(getDoc);

  // Initialize nodes and links
  useEffect(() => {
    if (!materials){
        return;
    }
    const tagMap = new Map<string, GraphNode>();
    const materialNodes: GraphNode[] = materials.map((m, _) => ({
      id: `material-${m.id}`,
      label: m.title,
      type: "material" as const,
      materialType: m.type,
      x: dimensions.width / 2 + (Math.random() - 0.5) * 300,
      y: dimensions.height / 2 + (Math.random() - 0.5) * 300,
      vx: 0,
      vy: 0,
      radius: 8,
      mass: 2,
    }));

    const linkData: GraphLink[] = [];
    materials.forEach((m) => {
      m.tags.forEach((tag) => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, {
            id: `tag-${tag}`,
            label: tag,
            type: "tag" as const,
            x: dimensions.width / 2 + (Math.random() - 0.5) * 300,
            y: dimensions.height / 2 + (Math.random() - 0.5) * 300,
            vx: 0,
            vy: 0,
            radius: 6,
            mass: 1,
          });
        }
        linkData.push({
          source: `material-${m.id}`,
          target: `tag-${tag}`,
          strength: 0.3,
        });
      });
    });

    const tagNodes = Array.from(tagMap.values());
    nodesRef.current = [...materialNodes, ...tagNodes];
    linksRef.current = linkData;
  }, [dimensions]);

  // Force simulation
  const simulate = () => {
    const nodes = nodesRef.current;
    const links = linksRef.current;
    const alpha = 0.1;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    // Apply forces
    nodes.forEach((node) => {
      if (draggedNodeRef.current?.id !== node.id) {
        // Reset forces
        node.fx = 0;
        node.fy = 0;

        // Center force
        node.fx += (centerX - node.x) * 0.01;
        node.fy += (centerY - node.y) * 0.01;

        // Repulsion between nodes
        nodes.forEach((other) => {
          if (node.id !== other.id) {
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 200 && distance > 0) {
              const force = (1 / distance) * 50;
              if (node.fx && node.fy) {
                node.fx += (dx / distance) * force;
                node.fy += (dy / distance) * force;
              }
            }
          }
        });

        // Apply velocity
        node.vx = (node.vx + (node.fx || 0) * alpha) * 0.9;
        node.vy = (node.vy + (node.fy || 0) * alpha) * 0.9;
        node.x += node.vx;
        node.y += node.vy;

        // Bounds
        node.x = Math.max(
          node.radius,
          Math.min(dimensions.width - node.radius, node.x)
        );
        node.y = Math.max(
          node.radius,
          Math.min(dimensions.height - node.radius, node.y)
        );
      }
    });

    // Link forces
    links.forEach((link) => {
      const source = nodes.find((n) => n.id === link.source);
      const target = nodes.find((n) => n.id === link.target);
      if (source && target) {
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const idealDistance = 100;

        if (distance > 0) {
          const force = (distance - idealDistance) * link.strength * alpha;
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;

          if (draggedNodeRef.current?.id !== source.id) {
            source.vx += fx / source.mass;
            source.vy += fy / source.mass;
          }
          if (draggedNodeRef.current?.id !== target.id) {
            target.vx -= fx / target.mass;
            target.vy -= fy / target.mass;
          }
        }
      }
    });
  };

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const render = () => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Run simulation
      simulate();

      // Draw links
      linksRef.current.forEach((link) => {
        const source = nodesRef.current.find((n) => n.id === link.source);
        const target = nodesRef.current.find((n) => n.id === link.target);
        if (source && target) {
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);

          // Highlight connected links
          if (hoveredNode?.id === source.id || hoveredNode?.id === target.id) {
            ctx.strokeStyle = "rgba(147, 197, 253, 0.6)";
            ctx.lineWidth = 2;
          } else {
            ctx.strokeStyle = "rgba(75, 85, 99, 0.3)";
            ctx.lineWidth = 1;
          }
          ctx.stroke();
        }
      });

      // Draw nodes
      nodesRef.current.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        // Node colors
        if (node.type === "tag") {
          ctx.fillStyle = "#fbbf24";
        } else {
          switch (node.materialType) {
            case "video":
              ctx.fillStyle = "#c084fc";
              break;
            case "book":
              ctx.fillStyle = "#60a5fa";
              break;
            case "website":
              ctx.fillStyle = "#4ade80";
              break;
            case "document":
              ctx.fillStyle = "#fb923c";
              break;
            default:
              ctx.fillStyle = "#9ca3af";
          }
        }

        // Hover/selection effects
        if (hoveredNode?.id === node.id || selectedNode?.id === node.id) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = ctx.fillStyle;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fill();

        // Draw label on hover or selection
        if (hoveredNode?.id === node.id || selectedNode?.id === node.id) {
          ctx.fillStyle = "#ffffff";
          ctx.font = "12px Inter, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText(node.label, node.x, node.y - node.radius - 5);
        }
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, hoveredNode, selectedNode]);

  // Mouse interactions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current = { x, y };

      if (draggedNodeRef.current) {
        draggedNodeRef.current.x = x;
        draggedNodeRef.current.y = y;
        draggedNodeRef.current.vx = 0;
        draggedNodeRef.current.vy = 0;
      } else {
        const node = nodesRef.current.find((n) => {
          const dx = x - n.x;
          const dy = y - n.y;
          return Math.sqrt(dx * dx + dy * dy) < n.radius + 5;
        });
        setHoveredNode(node || null);
        canvas.style.cursor = node ? "pointer" : "default";
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const node = nodesRef.current.find((n) => {
        const dx = x - n.x;
        const dy = y - n.y;
        return Math.sqrt(dx * dx + dy * dy) < n.radius + 5;
      });

      if (node) {
        draggedNodeRef.current = node;
        setSelectedNode(node);
      }
    };

    const handleMouseUp = () => {
      draggedNodeRef.current = null;
    };

    const handleMouseLeave = () => {
      setHoveredNode(null);
      draggedNodeRef.current = null;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

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
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* Controls */}
      <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-80 backdrop-blur p-3 rounded-lg">
        <div className="text-white text-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            <span>Videos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span>Books</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span>Websites</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
            <span>Documents</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span>Tags</span>
          </div>
        </div>
      </div>

      {selectedNode && (
        <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-90 backdrop-blur text-white p-4 rounded-lg max-w-xs">
          <h3 className="font-semibold text-lg mb-2">{selectedNode.label}</h3>
          <p className="text-sm text-gray-300 mb-3">
            Type:{" "}
            {selectedNode.type === "tag" ? "Tag" : selectedNode.materialType}
          </p>
          {selectedNode.type === "material" && (
            <button onClick={() => {openModal(parseInt(selectedNode.id.split("-")[1]))}} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View details <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Modal */}
        <DocumentModal
          document={openedDocument}
          isOpen={isOpen}
          loading={loading}
          error={error}
          onClose={closeModal}
          onRetry={() => openedDocument && openModal(openedDocument.document_id)}
        />

      <div className="absolute bottom-4 right-4 text-gray-400 text-xs">
        Drag nodes to reorganize • Click to select
      </div>
    </div>
  );
};
