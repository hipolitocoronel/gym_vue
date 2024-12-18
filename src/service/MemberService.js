import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const memberService = {
    async getMembers(){
        try{
            const members = await pb.collection('miembros').getFullList({
                sort: '-nombre',
            });
            return members
        }catch(ex){
            console.log(ex)
        }
    },
    async createMember(memberData){
        try{
            await pb.collection('miembros').create(memberData);
        }catch(ex){
            console.log(ex)
        }
    },
    async deleteMember(memberID){
        try{
            await pb.collection('miembros').delete(memberID);
        }catch(ex){
            console.log(ex)
        }
    }
}
export default memberService