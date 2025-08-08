import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { config } from '@/config';
import { apiClient } from '@/config';
import { TenantRead, TenantUpdate } from '@/types';

const SettingsPage = () => {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<TenantRead | null>(config.tenant);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [formData, setFormData] = useState<TenantUpdate>({
    title: tenant?.title || '',
    description: tenant?.description || '',
    elevenlabs_agent_id: tenant?.elevenlabs_agent_id || '',
    sys_prompt: tenant?.sys_prompt || '',
  });

  useEffect(() => {
    if (!user || !hasPermission('update', 'tenant')) {
      navigate('/');
    }
  }, [user, hasPermission, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.patch('/tenants/current', formData);
      setTenant(response.data);
      setMessage({ type: 'success', text: 'Tenant updated successfully!' });
    } catch (error) {
      console.error('Failed to update tenant:', error);
      setMessage({ type: 'error', text: 'Failed to update tenant.' });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (!user || !hasPermission('update', 'tenant')) {
    return null; // or a loading spinner, or a "not authorized" message
  }

  return (
    <div className="p-8 relative">
      <Link to="/" className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Link>
      <h2 className="text-2xl font-bold mb-4">Admin Settings</h2>
      {message && (
        <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title ?? ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description ?? ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">ElevenLabs Agent ID</label>
          <input
            type="text"
            name="elevenlabs_agent_id"
            value={formData.elevenlabs_agent_id ?? ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">System Prompt</label>
          <textarea
            name="sys_prompt"
            value={formData.sys_prompt ?? ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="p-2 text-white bg-blue-500 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
