"use strict";
class Window{
    constructor(height, width, posx, posy){

        this.frame = document.createElement('div')
        this.top_bar = document.createElementNS('http://www.w3.org/2000/svg','svg')
        this.frame.style.borderRadius = '10px'
        this.frame.style.boxShadow = '0px 0px 5px 3px rgba(0, 0, 0, 0.1)'
        this.frame.style.transition = 'transform 0.2s ease-in'
        this.top_bar.style.width = `${width}px`
        this.top_bar.style.height = `${40}px`
        //default values
        this.frame.style.position = 'absolute'
        this.color = '#f8f8ff'
        //end

        //fields
        this.width = width
        this.height = height
        this.hasFocus = false
        this.posx = posx
        this.posy = posy
        this.click_offset = [0,0]
        this.#createCloseButton(this)
        //end
        
        this.frame.style.height = `${height+40}px`
        this.frame.style.width = `${width}px`
        this.frame.style.top = `${posy}px`
        this.frame.style.left = `${posx}px`
        this.frame.style.backgroundColor = this.color
       
        //register events
        this.frame.addEventListener('mousedown',(e) => this.#onClick(this,e))
        document.addEventListener('mouseup', () => this.hasFocus=false)
        document.addEventListener('mousemove', (e) => this.#moveWindow(this,e))

        //end
        this.frame.appendChild(this.top_bar)
        document.body.appendChild(this.frame)
    }

    #onClick(inst,event){
        inst.hasFocus = true
        inst.click_offset = [event.offsetX,event.offsetY]
    }

    #moveWindow(inst,event){
      if(inst.hasFocus){
          inst.posx = inst.posx + event.clientX - inst.posx - inst.click_offset[0] + window.scrollX
          inst.posy = inst.posy + event.clientY - inst.posy - inst.click_offset[1] + window.scrollY
          inst.frame.style.left  = `${inst.posx}px`
          inst.frame.style.top  = `${inst.posy}px`
        }
    }

    setBackgroundColor(color){
        this.color = color
        this.frame.style.backgroundColor = `${color}`
    }

    setID(id){
        this.id = id 
        this.frame.setAttribute('id',`${id}`)
    }

    #createCloseButton(inst){
        let height = 20
        let width = 20
        let color = inst.color
        const close_box_svg = document.createElementNS('http://www.w3.org/2000/svg','svg')
        close_box_svg.style.width = `${width}px`
        close_box_svg.style.height = `${height}px`
        close_box_svg.style.x = `${this.width - 30}px`
        close_box_svg.style.y = `${10}px`
        const close_box_rect = document.createElementNS('http://www.w3.org/2000/svg','rect')
        close_box_rect.style.width = `${width}px`
        close_box_rect.style.height = `${height}px`
        close_box_rect.style.fill = color
        const rect1 = document.createElementNS('http://www.w3.org/2000/svg','rect')
        const rect2 = document.createElementNS('http://www.w3.org/2000/svg','rect')
        rect1.style.width = '1px'
        rect1.style.height = '20px'
        rect1.style.x = `${this.width-20}px`
        rect1.style.y = `${10}px`
        rect1.style.fill = 'black'
        rect1.style.transformOrigin = `${this.width-20}px ${20}px`
        rect1.style.transform = 'rotate(-45deg)'
        rect2.style.width = '1px'
        rect2.style.height = '20px'
        rect2.style.height = 'black'
        rect2.style.x = `${this.width-20}px`
        rect2.style.y = `${10}px`
        rect2.style.transformOrigin = `${this.width-20}px ${20}px`
        rect2.style.transform = 'rotate(45deg)'
        
        close_box_svg.appendChild(close_box_rect)
        close_box_rect.appendChild(rect1)
        close_box_rect.appendChild(rect2)
        inst.top_bar.appendChild(close_box_svg)
        
        function mouseOverHandler(e){
                rect1.style.fill = color
                rect2.style.fill = color
                close_box_rect.style.fill = 'salmon'
        }

        function mouseOutHandler(e){
            if(!inst.hasFocus){
                rect1.style.fill = 'black'
                rect2.style.fill = 'black'
                close_box_rect.style.fill = color
            }
        }

        function closeHandler(e){
            inst.frame.style.transformOrigin = '50% 50%'
            inst.frame.style.transform = 'scale(0)'
            document.removeChild(inst.frame)
        }

        close_box_rect.addEventListener('mouseover',mouseOverHandler)
        close_box_rect.addEventListener('mouseout',mouseOutHandler)
        close_box_rect.addEventListener('click',closeHandler)

    }
    



}



