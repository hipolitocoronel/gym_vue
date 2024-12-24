export default function getMembershipStatus(member) {
    let today = new Date();
    let expiredDate = new Date(member.fecha_vencimiento);
    return expiredDate >= today;
}
