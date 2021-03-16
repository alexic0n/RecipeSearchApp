import a from './backgrounds/1.jpg'
import b from './backgrounds/2.jpg'
import c from './backgrounds/3.jpg'
import d from './backgrounds/4.jpg'
import e from './backgrounds/5.jpg'
import f from './backgrounds/6.jpg'
import g from './backgrounds/7.jpg'
import h from './backgrounds/8.jpg'
import i from './backgrounds/9.jpg'
import j from './backgrounds/10.jpg'

function getStyle(){
    var qList = [a,b,c,d,e,f,g,h,i,j]
    var backg = qList[Math.floor(Math.random()*10)]
    const style = {
        backgroundImage: `url(${backg})`,
        backgroundRepeat: `noRepeat`,
        backgroundSize: `cover`,
        textAlign: `center`
    }
    return style
}

export default getStyle