interface PermissionGuardProps {
  start: () => void;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  start,
}: PermissionGuardProps) => {
  return (
    <div id='containter outside'>
      <button
        onClick={() => {
          start();
        }}
      >
        Click to start
      </button>
    </div>
  );
};
