import { computed, ref } from 'vue';
import useUserApi from '@/api/useUserApi';
import { useUserStore } from '@/stores/user';

const useUser = () => {
  const userStore = useUserStore();
  const { getUser } = useUserApi();

  const userLoading = ref(false);

  async function fetchUser(id: number = userStore.getUser.id) {
    try {
      userLoading.value = true;
      const u = await getUser(id);
      if (u?.data) {
        userStore.setUser(u.data);
        return u;
      }
    } catch (error) {
      console.error(error);
    } finally {
      userLoading.value = false;
    }
  }

  const user = computed(() => userStore.getUser);

  return {
    user,
    fetchUser,
    userLoading
  };
};

export default useUser;