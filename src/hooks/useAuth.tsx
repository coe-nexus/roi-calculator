import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiClient } from '../config';
import { JWTInterface, UserRead, PermissionRead } from '../types';

interface AuthContextType {
  user: UserRead | null;
  permissions: PermissionRead[];
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (action: string, resource: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserRead | null>(null);
  const [permissions, setPermissions] = useState<PermissionRead[]>([]);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const userResponse = await apiClient.get('/users/current');
          const currentUser = userResponse.data as UserRead;
          setUser(currentUser);

          const permissionsResponse = await apiClient.get(`/users/${currentUser.user_id}/permissions`);
          setPermissions(permissionsResponse.data as PermissionRead[]);
        } catch (error) {
          console.error("Failed to fetch user data", error);
          logout();
        }
      } else {
        delete apiClient.defaults.headers.common['Authorization'];
      }
    };
    fetchUser();
  }, [token]);

  const login = async (username: string, password: string) => {
    const response = await apiClient.post('auth/login', new URLSearchParams({
      username,
      password
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const { access_token } = response.data as JWTInterface;
    localStorage.setItem('authToken', access_token);
    setToken(access_token);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setPermissions([]);
  };

  const hasPermission = (action: string, resource: string) => {
    return permissions.some(p => 
      (p.action === action || p.action === '*') && 
      (p.resource === resource || p.resource === '*')
    );
  };

  return (
    <AuthContext.Provider value={{ user, permissions, token, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
