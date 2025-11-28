import React from 'react';
import { usePermission } from '../../hooks/usePermission';

const PermissionGate = ({ permissions, children, renderOtherwise = null }) => {
  const { can } = usePermission();

  // Permite passar uma única permissão ou um array (precisa ter TODAS ou ALGUMA? Vamos assumir UMA delas)
  const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
  
  // Verifica se o usuário tem pelo menos uma das permissões exigidas
  const hasPermission = requiredPermissions.some(p => can(p));

  if (hasPermission) {
    return <>{children}</>;
  }

  return renderOtherwise;
};

export default PermissionGate;