import { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDriverApplication } from '../context/DriverApplicationContext';

/** `/application` bookmark: open the driver form as an overlay, then replace URL with `/`. */
export default function Application() {
  const navigate = useNavigate();
  const { openDriverModal } = useDriverApplication();

  useLayoutEffect(() => {
    openDriverModal();
    navigate('/', { replace: true });
  }, [navigate, openDriverModal]);

  return null;
}
