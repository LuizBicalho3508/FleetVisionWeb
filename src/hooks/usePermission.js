import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPermissionsByRole, ROLES } from '../config/roles';

export const usePermission = () => {
  const { user } = useAuth();

  const can = useCallback((permission) => {
    if (!user) return false;

    // Determina a role atual
    let role = ROLES.CLIENTE; // Default
    if (user.administrator) role = ROLES.ADMIN;
    else if (user.attributes?.role) role = user.attributes.role;

    const userPermissions = getPermissionsByRole(role, user.administrator);
    
    return userPermissions.includes(permission);
  }, [user]);

  // Helper para verificar Role específica
  const hasRole = useCallback((targetRole) => {
    if (!user) return false;
    if (user.administrator && targetRole === ROLES.ADMIN) return true;
    return user.attributes?.role === targetRole;
  }, [user]);

  return { can, hasRole };
};