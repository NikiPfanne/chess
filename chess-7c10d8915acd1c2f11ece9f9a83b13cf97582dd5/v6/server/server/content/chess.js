
function make_board(id, height,  width){
    const board = document.createElementNS('http://www.w3.org/2000/svg','svg')
    board.style.width = `${width}px`
    board.style.height = `${height}px`
    let w_field = width/8
    let h_field = height/8
    for(let y = 0; y < 8; y++){
        for(let x = 0; x < 8; x++) {
            const rect = document.createElementNS('http://www.w3.org/2000/svg','rect')
            rect.style.width = `${w_field}px`
            rect.style.height = `${h_field}px`
            rect.setAttribute('x',`${w_field * x}`)
            rect.setAttribute('y',`${h_field * y}`)
            if(y%2 == 0){
                rect.style.fill = x%2 == 0 ? '#241623' : '#f7f7f2'
            }else{
                rect.style.fill = x%2 != 0 ? '#241623' : '#f7f7f2'
            }
            board.appendChild(rect)
        }
    }
    document.getElementById(id).appendChild(board)
}
