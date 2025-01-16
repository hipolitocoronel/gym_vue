export default function getPaymentStatus(paymentStatus) {
    switch (paymentStatus) {
        case 'pendiente':
            return 'warn';
        case 'aprobado':
            return 'success';
        case 'rechazado':
            return 'danger';
    }
}
