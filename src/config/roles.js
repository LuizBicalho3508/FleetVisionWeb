// Definição das Roles (Papéis) e suas Permissões (Capabilities)
export const ROLES = {
  ADMIN: 'admin',
  FILIAL: 'filial',
  CLIENTE: 'cliente',
  MOTORISTA: 'motorista'
};

export const PERMISSIONS = {
  // Ações de Veículo
  VIEW_VEHICLES: 'view_vehicles',
  CREATE_VEHICLES: 'create_vehicles',
  EDIT_VEHICLES: 'edit_vehicles',
  DELETE_VEHICLES: 'delete_vehicles',
  
  // Ações de Usuário
  VIEW_USERS: 'view_users',
  MANAGE_USERS: 'manage_users', // Criar/Editar/Deletar
  
  // Financeiro & Admin
  VIEW_FINANCIAL: 'view_financial',
  VIEW_AUDIT: 'view_audit',
  MANAGE_BRANDING: 'manage_branding',
  
  // Operacional
  VIEW_MAP: 'view_map',
  VIEW_REPORTS: 'view_reports',
  MANAGE_GEOFENCES: 'manage_geofences',
  MANAGE_MAINTENANCE: 'manage_maintenance'
};

// Matriz de Acesso
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS), // Admin pode tudo
  
  [ROLES.FILIAL]: [
    PERMISSIONS.VIEW_VEHICLES, PERMISSIONS.CREATE_VEHICLES, PERMISSIONS.EDIT_VEHICLES,
    PERMISSIONS.VIEW_USERS, PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_MAP, PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_GEOFENCES, PERMISSIONS.MANAGE_MAINTENANCE,
    PERMISSIONS.MANAGE_BRANDING // Filial pode personalizar sua view
  ],
  
  [ROLES.CLIENTE]: [
    PERMISSIONS.VIEW_VEHICLES,
    PERMISSIONS.VIEW_MAP, PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_GEOFENCES // Cliente pode criar suas cercas
  ],
  
  [ROLES.MOTORISTA]: [
    PERMISSIONS.VIEW_MAP // Motorista vê apenas o mapa (simplificado)
  ]
};

export const getPermissionsByRole = (role, isAdministrator) => {
  if (isAdministrator) return ROLE_PERMISSIONS[ROLES.ADMIN];
  
  // Mapeia a role do backend (string) para nossa constante
  // Supondo que no backend: admin=true, ou attribute.role='filial'/'cliente'
  const normalizedRole = role || ROLES.CLIENTE; 
  return ROLE_PERMISSIONS[normalizedRole] || [];
};