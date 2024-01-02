import React, { useEffect, useRef, useState } from 'react';
import './AlertHead.scss';



function AlertHead() {
    const [isopen, setisopen] = useState(false);
    const [ischatbox, setchatbox] = useState({
        left: '60px',
        top: '60px',
        right: 'none'
    });

    const containerRef = useRef();
    const boxRef = useRef();

    const isClicked = useRef(false);

    const coords = useRef({
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0
    })
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
  
    const handleSendMessage = () => {
      if (newMessage.trim() !== '') {
        setMessages([...messages, { text: newMessage, sender: 'user' ,time: new Date().toLocaleTimeString() }]);
        setNewMessage('');
      }
    };
    useEffect(() => {
        if (!boxRef.current || !containerRef.current) return;

        const box = boxRef.current;
        const container = containerRef.current;

        const onMouseDown = (e) => {

            if (e.target === box) {
                isClicked.current = true;
                coords.current.startX = e.clientX;
                coords.current.startY = e.clientY;
            }
            console.log('mouseDown',coords.current);

        }

        const onMouseUp = (e) => {

            if (!isClicked.current) return; // Add this check to handle onMouseUp only when the mouse button is still clicked
            isClicked.current = false;
            coords.current.lastX = box.offsetLeft;
            coords.current.lastY = box.offsetTop;

            // // console.log(nearWidth)
            // if(nearWidth < coords.current.lastX){
            //     box.style.left = 'auto';
            //     box.style.right='0px';
            //     setchatbox({
            //         left: 'auto',
            //         top: `${coords.current.lastY+60}px`,
            //         right:'0px'
            //     })
            //     coords.current.startX= e.clientX;
                
            //     // console.log('right');
            // }else{
            //     box.style.left = `0px`;
            //     box.style.right='auto'
            //     setchatbox({
            //         left: '0px',
            //         top: `${coords.current.lastY+60}px`,
            //         right:'auto'
            //     })
            //     coords.current.startX= e.clientX;
            //     // console.log('left');
            // }
         
        }

        const onMouseMove = (e) => {
            if (!isClicked.current) return;
            console.log('moving',coords.current);

            const nextX = e.clientX - coords.current.startX + coords.current.lastX;
            const nextY = e.clientY - coords.current.startY + coords.current.lastY;

            box.style.top = `${nextY}px`;
            box.style.left = `${nextX}px`;
            const nearWidth = window.innerWidth/2
            if(nearWidth > e.clientX){
            setchatbox({
                left: `${nextX+60}px`,
                top: `${nextY+60}px`,
                right:'auto'
            })
        }else{
            setchatbox({
                left: `${nextX-350}px`,
                top: `${nextY+60}px`,
                right:'auto'
            })
        }
        }

        box.addEventListener('mousedown', onMouseDown);
        box.addEventListener('mouseup', onMouseUp);
        container.addEventListener('mousemove', onMouseMove);
        container.addEventListener('mouseleave', onMouseUp);

        const cleanup = () => {
            box.removeEventListener('mousedown', onMouseDown);
            box.removeEventListener('mouseup', onMouseUp);
            container.removeEventListener('mousemove', onMouseMove);
            container.removeEventListener('mouseleave', onMouseUp);
        }

        return cleanup;
    }, [])

    const handleOpen = () => {
        setisopen(!isopen); // Close the chat box
    }



    return (
        <main className='alert'>
            <div ref={containerRef} className="containerAlert">
                <div ref={boxRef} onClick={handleOpen} className="box">
                </div>
                {isopen && (
                        <div   style={{ top: ischatbox.top ,left:ischatbox.left }} className="chat-box">
      <div class="chat-messages">
        <div class="chat">
          <div class="chat-content clearfix">
            <span class="friend last">
                  Hi, How are You?
                  <span class="time">
                    7:30 PM
                  </span>
            </span>
           
           {messages.map((message, index) => (
            <span class="you first">
                   {typeof message.text === 'object' ? (
            <div>
              {JSON.stringify(message.text, null, 2)}
            </div>
          ) : (
            <span className={`you ${index === 0 ? 'first' : ''}`}>
              {message.text}
              <span className="time">
                {message.time}
              </span>
            </span>
          )}
                  <span class="time">
                    {message.time}
                  </span>
            </span>
                            ))}



            
          </div>

          <div class="msg-box">
            <input
             value={newMessage}
             onChange={(e) => setNewMessage(e.target.value)}
            type="text" class="ip-msg" placeholder="Enter Here..." />
            <div class="btn-group">
                  <svg viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M819.5 783.7h-51.3c-16.6 0-30 13.4-30 30s13.4 30 30 30h51.3c16.6 0 30-13.4 30-30s-13.5-30-30-30zM665.7 783.7H143.9c-16.6 0-30 13.4-30 30s13.4 30 30 30h521.8c16.6 0 30-13.4 30-30s-13.5-30-30-30z" fill="#33CC99"></path><path d="M834.7 940.7H230.1c-23.9 0-43.5-19.6-43.5-43.5s19.6-43.5 43.5-43.5h604.6c23.9 0 43.5 19.6 43.5 43.5s-19.5 43.5-43.5 43.5z" fill="#FFB89A"></path><path d="M791.8 409.6H665.7c-16.6 0-30 13.4-30 30s13.4 30 30 30h126.2c41 0 74.4 33.4 74.4 74.4v281.3c0 41-33.4 74.4-74.4 74.4H232.4c-41 0-74.4-33.4-74.4-74.4V544c0-41 33.4-74.4 74.4-74.4h139.3c16.6 0 30-13.4 30-30s-13.4-30-30-30H232.4C158.3 409.6 98 469.9 98 544v281.3c0 74.1 60.3 134.4 134.4 134.4h559.4c74.1 0 134.4-60.3 134.4-134.4V544c0-74.1-60.3-134.4-134.4-134.4z" fill="#6A62C6"></path><path d="M362.3 272.1l118.8-118.8v550.9c0 16.6 13.4 30 30 30s30-13.4 30-30V153.3l118.8 118.8c5.9 5.9 13.5 8.8 21.2 8.8s15.4-2.9 21.2-8.8c11.7-11.7 11.7-30.7 0-42.4L552.6 80c-11.1-11.1-25.9-17.2-41.5-17.2-15.7 0-30.4 6.1-41.5 17.2L319.9 229.7c-11.7 11.7-11.7 30.7 0 42.4s30.7 11.7 42.4 0z" fill="#6A62C6"></path></g></svg>
            <svg onClick={handleSendMessage}  fill="#5F57C2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="m23.615.161c.228.152.376.408.376.698 0 .056-.006.111-.016.164l.001-.005-3.426 20.56c-.045.261-.204.478-.424.6l-.004.002c-.117.067-.257.107-.406.107-.003 0-.007 0-.01 0-.116-.003-.226-.027-.326-.069l.006.002-7.054-2.88-3.989 4.377c-.146.172-.362.281-.604.281-.009 0-.018 0-.026 0h.001c-.008 0-.017 0-.026 0-.102 0-.198-.02-.287-.056l.005.002c-.167-.061-.304-.17-.398-.311l-.002-.003c-.092-.135-.147-.302-.147-.482 0-.003 0-.005 0-.008v-6.047l-6.32-2.583c-.311-.107-.531-.395-.535-.736-.003-.028-.005-.06-.005-.092 0-.304.173-.567.427-.696l.004-.002 22.275-12.85c.122-.084.274-.135.437-.135.179 0 .344.061.475.162l-.002-.001zm-4.578 20.065 2.96-17.709-19.196 11.07 4.498 1.834 11.551-8.553-6.4 10.668z"></path></g></svg>
                </div>
          </div>

        </div>
      </div>

    </div>
    
                )}
            </div>
        </main>
    );
}

export default AlertHead;
