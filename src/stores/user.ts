import { defineStore } from 'pinia';
import { IUser } from '@/interfaces/user';

interface IUserState {
  user: IUser | null
  users: IUser[] | []
}

export const useUserStore = defineStore('user', {
  state: (): IUserState => ({
    user: null,
    users: [],
  }),
  getters: {
    getUser: (state) => state.user,
    getUsers: (state) => state.users
  },
  actions: {
    setUser(user) {
      this.user = user
    },
    setUsers(users) {
      this.users = users
    }
  },
})