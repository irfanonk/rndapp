import * as SecureStore from 'expo-secure-store';



export async function save(key: string, value: string) {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.warn(`can't save the value`, error);
  }
}

export async function getValueFor(key: string) {
  try {
    const result = await SecureStore.getItemAsync(key);

    return result;
  } catch (error) {
    console.warn(`can't get the value`, error);
  }
}

export async function deleteValue(key: string) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.warn(`can't delete the key`, error);
  }
}
