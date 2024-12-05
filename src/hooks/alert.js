import {toast as ogToast} from "react-toastify"


export const toast = (message, options) => {  
  return ogToast(<Popup message={message} type={options.type} />, {type: options.type});
}  

export const Popup = (props) => {
  return (
    <div>
      <div className="popup-box text-center">
        <div className="close-btn text-right">
        {/* <img className="me-2" role="button" src="/signin/close.svg"/> */}
        </div>
        {/* {props.type === "success" && <img src="/checkmark-done.svg" />}
        {props.type === "error" && <img src="/danger.svg" />}
        {props.type === "warning" && <img src="/warning.svg" />} */}
                
        {/* <div className={`${props.type}-icon`}></div> */}
        <h3 className={`f-63 mt-4 mb-1 ${props.type}`}>{props.message}</h3>
        <h6 className={`f-53 ${props.type}`}>{props.details}</h6>
      </div>
    </div>
  );
}