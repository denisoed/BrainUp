import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { IUser } from '@/interfaces/user';

const useUser = () => {
  const userStore = useUserStore();

  async function setUser(user: IUser) {
    userStore.setUser(user);
  }

  const user = computed(() => userStore.getUser);

  return {
    user,
    setUser,
  };
};

export default useUser;