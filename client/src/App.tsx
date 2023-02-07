import { FC, useContext, useEffect, useState } from 'react'
import { Context } from './index'
import LoginForm from './components/LoginForm'
import { observer } from 'mobx-react-lite'
import { IUser } from './models/IUser'
import UserSetvice from './services/UserService'

const App: FC = () => {
  const { store } = useContext(Context)
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  const getUsers = async () => {
    try {
      const response = await UserSetvice.fetchUsers()
      setUsers(response.data)
    } catch (e) {
      console.log(e)
    }
  }

  if (store.isLoading) {
    return <h2>Loading...</h2>
  }

  if (!store.isAuth) {
    return (
      <>
        <LoginForm />
        <div>
          <button onClick={getUsers}>Получить пользователей</button>
        </div>
      </>
    )
  }

  return (
    <div>
      <h1>
        {store.isAuth
          ? `Пользователь ${store.user.email} авторизован`
          : 'Авторизуйтесь'}
      </h1>
      <h1>
        {store.user.isActivated
          ? 'Аккаунт подтвержден'
          : 'Аккаунт не подтвержден'}
      </h1>
      <button onClick={() => store.logout()}>Выйти</button>
      <div>
        <button onClick={getUsers}>Получить пользователей</button>
      </div>
      {users &&
        users.map((user) => {
          return <div key={user.email}>{user.email}</div>
        })}
    </div>
  )
}

export default observer(App)
