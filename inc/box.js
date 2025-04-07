const boxClose = () => {
    const boxes = document.querySelectorAll('.box')
    const closeBtns = document.querySelectorAll('.close')
    closeBtns.forEach(element => {
        element.addEventListener('click', e => {
            e.preventDefault()
            //alert('click')
            e.target.parentElement.classList.add('hidden')
        })
    });
}

export default boxClose