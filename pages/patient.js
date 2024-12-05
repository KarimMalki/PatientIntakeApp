import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Patient() {
  const router = useRouter();

  useEffect(() => {
    router.push('/patientdashboard');
  }, []);

  return null;
}
