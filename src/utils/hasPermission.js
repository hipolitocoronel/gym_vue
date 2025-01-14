export function hasPermission(userPermisions = [], requiredPermission) {
    return userPermisions.some((p) => p.permiso.includes(requiredPermission));
}
