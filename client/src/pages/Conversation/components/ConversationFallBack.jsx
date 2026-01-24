import { useNavigate } from "react-router-dom";
import useDeviceSize from "../../../hooks/useDeviceSize";

function ConversationFallBack() {
  const navigate = useNavigate();
  return (
    <div className="md:flex flex-col hidden  justify-center items-start gap-3 w-[80%] p-32 pt-0 h-full ">
      <h1 className="lg:text-3xl text-xl font-bold text-oplight ">
        Select a conversation to start interaction with users
      </h1>
      <p className=" opacity-60 font-thin lg:text-sm text-xs">
        You can create a new conversation by clicking on the +Icon button or
        chose from existing conversations on the left.
      </p>
      <button
        className="px-4 py-2 lg:text-base text-sm text-nowrap dark:bg-white bg-oplight text-white dark:text-black rounded-full hover:opacity-80 transition-all duration-300"
        onClick={() => navigate("new/c")}
      >
        Start New Conversation
      </button>
    </div>
  );
}

export default ConversationFallBack;
