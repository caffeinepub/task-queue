import { toast } from 'sonner';

export function showNotification(
  message: string,
  type: 'success' | 'info' | 'warning' = 'success'
): void {
  switch (type) {
    case 'success':
      toast.success(message);
      break;
    case 'info':
      toast.info(message);
      break;
    case 'warning':
      toast.warning(message);
      break;
    default:
      toast(message);
  }
}
