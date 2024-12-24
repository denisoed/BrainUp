import telegram from '@/boots/telegram';
import interceptor from '@/boots/interceptor';
import sentry from '@/boots/sentry';

function initBoots(params) {
  const boots = [
    telegram,
    interceptor,
    sentry
  ]

  for (let i = 0; i < boots.length; i++) {
    const boost = boots[i];
    boost(params);
  }
}

export default initBoots;
