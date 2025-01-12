export default function smoothScroll(id, closeCallback = null) {
    document.body.click();
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    if (closeCallback) closeCallback();
}
