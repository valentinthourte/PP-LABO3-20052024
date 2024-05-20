export function mostrarSpinner() {
    action(true);
}
export function esconderSpinner() {
    action();
}


function action(visible = false) {
    const display = visible ? 'flex' : 'none';
    document.getElementById('spinner').style.display = display;
}