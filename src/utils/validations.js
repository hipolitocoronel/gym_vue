import pb from '@/service/pocketbase';
export async function isUniqueItem(collection, field, value) {
    try {
        await pb.collection(collection).getFirstListItem(`${field} = ${value}`);
        return false;
    } catch (error) {
        if (error.status === 404) {
            return true;
        }
    }
}
