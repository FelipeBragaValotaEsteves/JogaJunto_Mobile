import AsyncStorage from '@react-native-async-storage/async-storage';

export const authHeaders = async () => {
    const t1 = await AsyncStorage.getItem('userToken');
    const t2 = await AsyncStorage.getItem('token');
    const token = t1 || t2 || '';
    return { Authorization: token ? `Bearer ${token}` : '' };
};

export async function getUserId() {
  try {
    const userId = await AsyncStorage.getItem('userId');
    return userId;
  } catch (error) {
    console.error('Erro ao recuperar o ID do usuário:', error);
    return null;
  }
}
