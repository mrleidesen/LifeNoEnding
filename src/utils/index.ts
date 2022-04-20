import type { TCourse } from '@/types/course';
import type { TUser } from '@/types/user';
import type { TWork } from '@/types/work';

export function getDisabledStatus(user?: TUser, item?: TWork | TCourse) {
  if (!user || !item) {
    return true;
  }

  let disabled = false;
  const hp = user.hp;
  const exp = user.exp;

  if (hp <= 0) {
    disabled = true;
  }
  if (exp < item.limit) {
    disabled = true;
  }
  if ('time' in item) {
    const start = new Date(item.time.start);
    const end = new Date(item.time.end);
    const now = new Date();
    if (now < start || now > end) {
      disabled = true;
    }
  }

  return disabled;
}
