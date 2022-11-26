/*
    utility functions
*/



function labelValidator(x,y){
    if(x.length != y.length){
        return false;
    }
    return true;
}

function getElementDimensions(parent ,element){
    parent.appendChild(element)
    document.body.appendChild(parent)
    var rect = element.getBBox()
    document.body.removeChild(parent)
    return [rect.width,rect.height]
}

/**
 * 
 * @returns the an svg filter element whitch is used to display a drop-shadow
 */
function getSchadowFilter(){
  var defs = document.createElementNS('http://www.w3.org/2000/svg','defs')
  var filter = document.createElementNS('http://www.w3.org/2000/svg','filter')
  filter.setAttribute('id','shadow')
  filter.setAttribute('x','-15%')
  filter.setAttribute('y','-15%')
  filter.setAttribute('width','130%')
  filter.setAttribute('height','130%')
  var offset = document.createElementNS('http://www.w3.org/2000/svg','feOffset')
  offset.setAttribute('result','offOut')
  offset.setAttribute('in','SourceAlpha')
  offset.setAttribute('dx','0')
  offset.setAttribute('dy','1.3')
  var blur = document.createElementNS('http://www.w3.org/2000/svg','feGaussianBlur')
  blur.setAttribute('result','blurOut')
  blur.setAttribute('in','offOut')
  blur.setAttribute('stdDeviation','.8')
  var blend = document.createElementNS('http://www.w3.org/2000/svg','feBlend')
  blend.setAttribute('in','SourceGraphic')
  blend.setAttribute('in2','blurOut')
  blend.setAttribute('mode','normal')
  filter.appendChild(offset)
  filter.appendChild(blur)
  filter.appendChild(blend)
  defs.appendChild(filter)
  return filter
}


class Tooltip{
    /**
     * Represents a Tooltip widget which can be displayed on a :hover or :click event relative to the
     * firing element or relative to the mouse
     * @param {number} width
     * @param {number} height
     * @param {String} color
     */
    constructor(width, height, color){
        this.shadow_space = 2
        this.width = width + 2*this.shadow_space
        this.height = height +2*this.shadow_space
        this.svg_frame = document.createElementNS('http://www.w3.org/2000/svg','svg')
        this.y_offset = height/8
        var roundness = 10
        this.svg_frame.style.width = `${this.width}`
        this.svg_frame.style.height = `${this.height}`
        this.rect = document.createElementNS('http://www.w3.org/2000/svg','rect')
        this.rect.style.width = `${width}px`
        this.rect.style.height = `${height-this.y_offset}px`
        this.rect.style.fill = color
        this.rect.setAttribute('y',`${this.shadow_space}`)
        this.rect.setAttribute('x',`${this.shadow_space}`)
        this.rect.setAttribute('rx',`${roundness}`)
        this.rect.setAttribute('ry',`${roundness}`)
        this.triangle = document.createElementNS('http://www.w3.org/2000/svg','polygon')
        this.triangle.setAttribute('points',`${this.width/2},${height} ${this.width-(roundness+this.width/3.5)},${height-this.y_offset-1} ${0+roundness+this.width/3.5},${height-this.y_offset-1}`)
        this.triangle.style.fill = color
        var g = document.createElementNS('http://www.w3.org/2000/svg','g')
        //g.style.filter = 'drop-shadow(0px 2px 1px rgba(0, 0, 0, .3))'
        g.style.filter = "url(#shadow)"
        g.appendChild(this.rect)
        g.appendChild(this.triangle)
        this.svg_frame.appendChild(g)
    }

    getHeight(){
        return this.height
    }

    getWidth(){
        return this.width
    }

    getElement(){
        return this.svg_frame
    }

    setText(text, color, font_size, dims){
        var t = null
        if(!(text instanceof SVGTextElement)){
            t = document.createElementNS('http://www.w3.org/2000/svg','text')
            t.setAttribute('text-anchor','start')
            t.setAttribute('y',`${this.y_offset}`)
            t.setAttribute('x',`${0}`)
            t.style.fontSize = `${font_size}`
            t.style.fill = color
            t.innerHTML = text
            t.style.fontFamily ='arial'
        }else{
            t = text
        }
        if(dims === undefined)
        var dims = getElementDimensions(this.svg_frame,t)
        var w_rest = this.width-2*this.shadow_space-dims[0]
        var h_rest = (this.height-2*this.shadow_space-this.y_offset*2)-dims[1]
        t.setAttribute('y',`${0+h_rest/2+dims[1]+this.shadow_space}`)
        t.setAttribute('x',`${0+w_rest/2+this.shadow_space}`)
        this.svg_frame.appendChild(t)
    }

}


class TooltipBuilder{

    /**
     * Utility class to construct a tooltip based on the size of it's text
     * and a given x and y offset
     * @param {String} text
     * @param {*} text_color
     * @param {*} font_size
     * @param {*} background_color
     * @param {number} x_offset
     * @param {number} y_offset
     */
    constructor(text, text_color, font_size, background_color , x_offset, y_offset){
        var generic_svg = document.createElementNS('http://www.w3.org/2000/svg','svg')
        generic_svg.style.height = window.height
        generic_svg.style.width = window.width
        var t = document.createElementNS('http://www.w3.org/2000/svg','text')
        t.setAttribute('text-anchor','start')
        t.setAttribute('y',`${0}`)
        t.setAttribute('x',`${0}`)
        t.style.fontSize = `${font_size}`
        t.style.fill = text_color
        t.innerHTML = text
        t.style.fontFamily ='arial'
        var dims = getElementDimensions(generic_svg,t)
        this.tooltip = new Tooltip(dims[0]+x_offset,dims[1]+y_offset,background_color)
        this.tooltip.setText(t,text_color,font_size,dims)
    }

    build(){
        return this.tooltip
    }
}


class ScreenPane{

    /**
     * Adds an invisible layer above the web-page, which allows for custom Tooltips or
     * other tooltips to be displayed on events like the :hover event.
     * Elements which are supposed to trigger the display of such a tooltip are added via
     * the according methods on the ScreenPane object.
     */
    constructor(){
        this.svg_canvas = document.createElementNS('http://www.w3.org/2000/svg','svg')
        this.svg_canvas.appendChild(getSchadowFilter())
        document.body.append(this.svg_canvas)
        this.svg_canvas.style.width = '100vw'
        this.svg_canvas.style.height = '100vh'
        this.svg_canvas.style.zIndex = '10'
        this.svg_canvas.style.position = 'fixed'
        this.svg_canvas.style.pointerEvents = 'none'
        this.svg_canvas.style.top = '0'
        this.svg_canvas.style.left = '0'
        this.mouse_on = null
        document.addEventListener('mousemove', (e) => this.#mouseMoveHandler(e))
    }

    /**
     * Adds a Tooltip that appears on :hover on a given HTMLElement
     * @param {HTMLElement} element
     * @param {Tooltip} tooltip
     */
    addElementHoverWidget(element, tooltip){
        element.addEventListener('mouseover',(e) => this.#register(tooltip,e))
        element.addEventListener('mouseout',(e) => this.#resetMouseOn())
    }

    /**
     * Checks wether a given list contains an element
     * @param  element
     * @param  {Iterable} list
     * @returns
     */
    #isIn(element, list){
        var result = false
        for(var e of list){
            if(e === element) result = true
        }
        return result
    }

    /**
     * Sets the mouse_on object-attribute to the HTTMLElement
     * the mouse is currently on.
     * @param {Tooltip} Tooltip
     * @param e
     */
    #register(tooltip,e){
        this.mouse_on = [tooltip,e.srcElement]
    }

    /**
     * Removes the current HTTMLElement from the
     * mouse_on object-attriute if the mouse leaves the
     * element
     */
    #resetMouseOn(){
        if(this.mouse_on === null) return
        if(this.#isIn(this.mouse_on[0].getElement(),this.svg_canvas.children))
           this.svg_canvas.removeChild(this.mouse_on[0].getElement())
        this.mouse_on = null
    }

    #mouseMoveHandler(event){
        if(this.mouse_on != null){
            this.mouse_on[0].getElement().setAttribute('x',`${event.x - this.mouse_on[0].getWidth()/2}`)
            this.mouse_on[0].getElement().setAttribute('y',`${event.y - this.mouse_on[0].getHeight()+this.mouse_on[0].shadow_space}`)
            this.svg_canvas.append(this.mouse_on[0].getElement())
        }

    }

    /**
     * Places the Tooltip ove a HTTMLElement based on it's dimensions
     * @param {Tooltip} tooltip
     * @param e
     */
    #displayBasedOnElement(tooltip,e){
        const rect = e.srcElement.getBoundingClientRect()
        this.svg_canvas.append(tooltip)
        tooltip.setAttribute('x',`${rect.left + rect.width/2}`)
        tooltip.setAttribute('y',`${rect.top + rect.height/2}`)
    }

    /**
     * Removes a specific tooltip from the ScreenPane
     * @param {Tooltip tooltip
     */
    #kill(tooltip){
        this.svg_canvas.removeChild(tooltip)
    }

}


/**
 * PANE is global variable which represents a PANE on the
 * webside which is abolutely positioned and lies above all content
 */
var PANE = new ScreenPane()


class Graph{
    /**
     * Graph is a baseclass for all types of Graphs
     * @param {number} height 
     * @param {number} width 
     * @param {String} parent_id 
     * @param {String} target_class 
     */
    constructor(height, width , parent_id, target_class){
        this.height = height;
        this.width = width;
        this.tooltip = false;
        this.target_class = target_class;
        this.axisWidth = 2;
        this.offsetY = this.height/8;
        this.offsetX = this.width/10;
        this.axisColor = 'black'
        this.parent = document.getElementById(parent_id);
        this.svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        this.xAxis = document.createElementNS('http://www.w3.org/2000/svg','line');
        this.yAxis = document.createElementNS('http://www.w3.org/2000/svg','line');
        this.svg.setAttribute('height',`${height}`);
        this.svg.setAttribute('width',`${width}`);
        this.svg.style.display = 'block';
        this.svg.style.margin = 'auto';
        this.svg.setAttribute('class',target_class);
        this.parent.appendChild(this.svg);
        this.svg.appendChild(this.xAxis);
        this.svg.appendChild(this.yAxis);
    }

    #drawAxis(){
        this.xAxis.style.strokeWidth = `${this.axisWidth}`;
        this.xAxis.style.stroke = this.axisColor;
        this.xAxis.style.opacity = 0.4;
        this.yAxis.style.strokeWidth = `${this.axisWidth}`;
        this.yAxis.style.stroke = this.axisColor;
        this.yAxis.style.opacity = 0.4;
        this.xAxis.setAttribute('class',this.target_class+'Axis'+' '+this.target_class+' '+'X'+this.target_class);
        this.xAxis.setAttribute('x1',`${this.offsetX}`);
        this.xAxis.setAttribute('y1',`${this.height-this.offsetY}`);
        this.xAxis.setAttribute('x2',`${this.width-this.offsetX}`);
        this.xAxis.setAttribute('y2',`${this.height-this.offsetY}`);
        this.yAxis.setAttribute('class',this.target_class+"Axis"+" "+this.target_class);
        this.yAxis.setAttribute('x1',`${this.offsetX+this.axisWidth/2}`);
        this.yAxis.setAttribute('y1',`${this.offsetY}`);
        this.yAxis.setAttribute('x2',`${this.offsetX+this.axisWidth/2}`);
        this.yAxis.setAttribute('y2',`${this.height-this.offsetY-this.axisWidth/2}`);
    }

    setAxisWidth(width){
        this.axisWidth = width;
    }

    setOffsetX(offset){
        this.offsetX = offset;
    }

    setOffsetY(offset){
        this.offsetY = offset;
    }

    setAxisColor(color_string){
        this.axisColor = color_string;
    }

    setTooltip(bool){
        this.tooltip = bool
    }

    render(){
        this.#drawAxis();
    }
}

class LabeledChart extends Graph{
    #label_opacity = 0.4;
    #label_color = 'black';
    /**
     * The LabledChart is a baseclass for all labeled Charts.
     * @param {number} height 
     * @param {number} width 
     * @param {String} div_id 
     * @param {String} target_class 
     * @param {Array} y 
     * @param {Array} x 
     */
    constructor(height, width , div_id, target_class,y,x){
        super(height, width , div_id, target_class);
        this.x = x;
        this.y = y;
        this.xLabels = true
        this.yLabels = true
    }

    setXLabels(bool){
        this.xLabels = bool;
    }

    setYLabels(bool){
        this.yLabels = bool;
    }

    drawYLabels(){
        const spacer = this.offsetX/5;
        const font_size = this.offsetX/5;
        const height_left = this.height - 2*this.offsetY;
        const max_height = this.height-2*this.offsetY-this.axisWidth;
        const y_scale =  max_height/Math.max.apply(null,this.y);
        const sorted_y = this.y.slice();
        sorted_y.sort((a,b)=>a-b);
        let count = 0;
        const a = sorted_y.pop();
        const b = sorted_y[0];
        for(const bar_height of [a,b]){
            const text = document.createElementNS('http://www.w3.org/2000/svg','text');
            text.setAttribute('id',`${this.target_class}Text${count}`);
            text.setAttribute('class',`${this.target_class}Text`);
            text.setAttribute('fill',this.#label_color);
            text.setAttribute('font-size',font_size);
            text.setAttribute('y',`${this.offsetY+(max_height-bar_height*y_scale)+font_size/2}`);
            text.setAttribute('x',`${0+this.offsetX-((font_size/2)*bar_height.toString().length+this.axisWidth+spacer)}`);
            text.style.fontFamily = 'Helvetica, Arial, sans-serif';
            text.style.opacity = this.#label_opacity;
            const tspan = document.createElementNS('http://www.w3.org/2000/svg','tspan');
            const title = document.createElementNS('http://www.w3.org/2000/svg','title');
            title.innerHTML = bar_height;
            tspan.innerHTML = bar_height;
            text.appendChild(tspan);
            text.appendChild(title);
            this.svg.appendChild(text);
            count += 1;
        }

    }

    setHeadline(headline){
        //TODO: clean up headline box attrs 
        const headline_box = document.createElementNS('http://www.w3.org/2000/svg','svg');
        headline_box.style.width = this.width - this.offsetX;
        headline_box.style.height = `${this.offsetY}`;
        headline_box.style.x = `${this.offsetX}`;
        headline_box.style.y = '0';
        const headline_element = document.createElementNS('http://www.w3.org/2000/svg','text');
        headline_element.setAttribute('text-anchor','start');
        headline_element.setAttribute('y',`${0}`);
        headline_element.setAttribute('x',`${0}`);
        headline_element.style.fontSize = `${12}`;
        headline_element.style.fill = 'black';
        headline_element.style.opacity = `${0.6}`
        headline_element.innerHTML = headline;
        headline_element.style.fontFamily ='arial';
        const dims = getElementDimensions(headline_box,headline_element);
        headline_element.setAttribute('x',`${(this.width-this.offsetX-dims[0])/2+this.offsetX/2}`);
        headline_element.setAttribute('y',`${(this.offsetY-dims[1])/2+dims[1]}`);
        headline_box.appendChild(headline_element);
        this.svg.appendChild(headline_box)
        


    }

    setLabelOpacity(number_decimal){
        this.#label_opacity = number_decimal;
    }

    setLabelColor(color){
        this.#label_color = color;
    }
}

class BarChart extends LabeledChart{
    #bars = [];
    #bar_animation_time = 2;
    #color_fate_time = 0.5;
    /**
     * The BarChart allows to generate a barchart visualisation in given div via its id
     * @param {number} height 
     * @param {number} width 
     * @param {number} div_id 
     * @param {String} target_class 
     * @param {Array} y 
     * @param {Array} x 
     */
    constructor(height, width , div_id, target_class,y,x){
        super(height, width , div_id, target_class,y,x);
        this.bar_color = 'rgb(58, 171, 241)';
        this.bar_opacity = '0.3';
        this.hoverBrightness = 200;
        this.space = 10;
    }

    #onBarOver(event){
        event.srcElement.style.filter = `brightness(${this.hoverBrightness}%)`;
    }

    #onBarOut(event){
        event.srcElement.style.filter = `brightness(100%)`;
    }

    #drawBars(){
        const space_left = this.width - (this.x.length+1) * this.space - this.offsetX*2 -this.axisWidth;
        const max_height = this.height-2*this.offsetY-this.axisWidth;
        const y_scale =  max_height/Math.max.apply(null,this.y);
        const bar_width = space_left/this.x.length;
        let x_start = this.offsetX + this.axisWidth+this.space;
        let count = 0;
        for(const bar_height of this.y){
            const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
            rect.style.transition = `filter  ${this.#color_fate_time}s ease, height ${this.#bar_animation_time}s ease,y ${this.#bar_animation_time}s ease`;
            rect.setAttribute('id',`${this.target_class}Bar${count}`);
            rect.setAttribute('class',`${this.target_class}Bar ${this.target_class} X${this.target_class}`);
            rect.setAttribute('x',`${x_start}`);
            rect.setAttribute('y',`${this.height-(this.offsetY+this.axisWidth)}`);
            rect.setAttribute('height',`${0}`);
            rect.setAttribute('width',`${bar_width}`);
            rect.addEventListener("mouseover",(event)=>this.#onBarOver(event));
            rect.addEventListener("mouseout",(event)=>this.#onBarOut(event));
            rect.style.fill = this.bar_color;
            rect.style.fillOpacity = this.bar_opacity;
            this.svg.appendChild(rect);
            if(this.tooltip){
                const title = document.createElementNS('http://www.w3.org/2000/svg','title');
                title.innerHTML = bar_height;
                rect.appendChild(title);
            }else{
                PANE.addElementHoverWidget(rect,new TooltipBuilder(`${bar_height}`,'black','12px','rgb(252,252,252)',20,20).build())
            }
            this.#bars.push({rectangle:rect,displayheight:bar_height*y_scale,y_pos:this.offsetY+(max_height-bar_height*y_scale),value:bar_height});
            x_start += bar_width + this.space;
            count ++;
        }
        window.addEventListener("load",() => this.#animateBars());
    }

    #animateBars(){
        for(const bar of this.#bars){
            bar.rectangle.setAttribute('height',`${bar.displayheight}`);
            bar.rectangle.setAttribute('y',`${bar.y_pos}`);
        }

    }

    setBarSpace(number_pixel){
        this.space = number_pixel;
    }

    setBarHoverBrightness(number_percent){
        this.hoverBrightness = number_percent;
    }

    setBarColor(color_string){
        this.bar_color = color_string;
    }

    setBarAnimationTime(num_in_s){
        this.#bar_animation_time = num_in_s;
    }

    setColorFateTime(num_in_s){
        this.#color_fate_time = num_in_s;
    }

    #scale(event){
        const width = this.svg.parentElement.offsetWidth;
        const elements = document.getElementsByClassName(`X${this.target_class}`);
        if(width < this.width){
            const scale = width/this.width;
            for(let e of elements){
                e.style.transformOrigin = `${this.offsetX}px ${this.height-this.offsetY}px`;
                e.style.transform = `scaleX(${scale})`;
            }
        }else{
            for(let e of elements){
                e.style.transform = 'scaleX(1)';
            }
        }
    }

    smartScale(number_decimal){
        window.addEventListener('load',() => this.#scale());
        window.addEventListener('resize', (event) => this.#scale(event), true);
    }

    render(){
        super.render();
        if(this.yLabels) super.drawYLabels();
        this.#drawBars();
    }
}


class DottedChart extends LabeledChart{
    #dots = []
    #total_animation_time = 1;
    /**
     * The DottedChart allows to generate a scatter-plot visualisation in given div via its id
     * @param {number} height 
     * @param {number} width 
     * @param {number} div_id 
     * @param {String} target_class 
     * @param {Array} y 
     * @param {Array} x 
     */
    constructor(height, width , div_id, target_class,y,x){
        super(height, width , div_id, target_class,y,x);
        this.dot_color = 'rgb(58, 171, 241)';
        this.dot_opacity = '0.3';
        this.hoverBrightness = 200;
        this.dot_radius = 10;
        this.color_fate_time = 0.5;
        this.dot_animation_time = 1;
    }

    #onDotOver(event){
        event.srcElement.style.filter = `brightness(${this.hoverBrightness}%)`;
    }

    #onDotOut(event){
        event.srcElement.style.filter = `brightness(100%)`;
    }

    #animateDots(){
        let count = 1;
        this.#dots.sort((a,b) => a[1]-b[1]);
        for(const dot of this.#dots){
            setTimeout(()=>dot[0].setAttribute('r',`${this.dot_radius}`),this.#total_animation_time/this.#dots.length*1000*count);
            count++;
        }
    }

    #drawDots(){
        const space_left = this.width - this.offsetX*2 -this.axisWidth-2*this.dot_radius;
        const max_height = this.height - this.offsetY*2 -this.axisWidth-2*this.dot_radius;
        const y_scale =  max_height/Math.max.apply(null,this.y);
        const x_scale =  space_left/Math.max.apply(null,this.x);
        for(let i = 0; i < this.y.length ; i++){
            const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
            circle.style.transition = `filter  ${this.color_fate_time}s ease, r ${this.dot_animation_time}s ease`;
            circle.setAttribute('id',`${this.target_class}Circle${i}`);
            circle.setAttribute('class',`${this.target_class}Circle ${this.target_class}`);
            circle.setAttribute('cx',`${this.offsetX+(this.x[i]*x_scale)+this.dot_radius+this.axisWidth}`);
            circle.setAttribute('cy',`${this.offsetY+(max_height-this.y[i]*y_scale)+this.dot_radius+this.axisWidth/2}`);
            circle.setAttribute('r',`0`);
            circle.style.fill = this.dot_color;
            circle.style.fillOpacity = this.dot_opacity;
            circle.addEventListener("mouseover",(event)=>this.#onDotOver(event));
            circle.addEventListener("mouseout",(event)=>this.#onDotOut(event));
            this.svg.appendChild(circle);
            if(this.tooltip){
                const title = document.createElementNS('http://www.w3.org/2000/svg','title');
                title.innerHTML = `x=${this.x[i]} y=${this.y[i]}`;
                circle.appendChild(title);
            }else{
                PANE.addElementHoverWidget(circle,new TooltipBuilder(`x=${this.x[i]} y=${this.y[i]}`,'black','12px','rgb(252,252,252)',20,20).build())
            }
            this.#dots.push([circle,this.x[i]]);
        }
        window.addEventListener('load',() => this.#animateDots());
    }

    setDotOpacity(number_decimal){
        this.dot_opacity = number_decimal;
    }

    setTotalAnimationTime(number_sec){
        this.#total_animation_time = number_sec;
    }

    setDotAnimationTime(number_sec){
        this.dot_animation_time = number_sec;
    }

    setDotColor(color){
        this.dot_color = color;
    }

    setDotRadius(number_pixel){
        this.dot_radius = number_pixel;
    }

    setDotHoverBrightness(number_percent){
        this.hoverBrightness = number_percent;
    }

    render(){
        super.render();
        super.drawYLabels();
        this.#drawDots();
    }
}

class LineChart extends LabeledChart{
    constructor(height, width , div_id, target_class,y,x){
        super(height, width , div_id, target_class,y,x);
        this.line_color = 'rgb(58, 171, 241)';
        this.line_opacity = '0.3';
        this.hoverBrightness = 200;
        this.line_radius = 10;
    }

}
