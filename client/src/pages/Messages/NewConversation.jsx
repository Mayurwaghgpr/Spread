import React, { memo, useRef } from "react";
import { PopupBox } from "../../component/utilityComp/PopupBox";
import SearchBar from "../../component/inputComponents/SearchBar";
import PeoplesList from "../../component/PeoplesList";
import { useDispatch, useSelector } from "react-redux";
import Ibutton from "../../component/buttons/Ibutton";
import { useInfiniteQuery, useMutation } from "react-query";
import usePublicApis from "../../Apis/publicApis";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import ChatApi from "../../Apis/ChatApi";
import { useNavigate } from "react-router-dom";
import { setOpenNewConverstionBox, setToast } from "../../redux/slices/uiSlice";
import LoaderScreen from "../../component/loaders/loaderScreen";
const NewConversation = () => {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { fetchAllUsers } = usePublicApis();
  const { startPrivateChate } = ChatApi();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  const { mutate: PrivateMutaion, isLoading: isPrivateLoading } = useMutation({
    mutationFn: (chatUserId) => startPrivateChate(chatUserId),
    onSuccess: (data) => {
      dispatch(setOpenNewConverstionBox());
      navigate(`c?Id=${data.conversation.id}`, { replace: true });
    },
    onError: () => {
      dispatch(
        setToast({ messge: "Fail to start conversation", type: "error" })
      );
    },
  });

  const { data, fetchNextPage, isFetchingNextPage, isFetching, hasNextPage } =
    useInfiniteQuery(
      ["UsersList"],
      ({ pageParam = new Date().toISOString() }) => fetchAllUsers(pageParam),
      {
        getNextPageParam: (lastPage) => {
          return lastPage.length !== 0
            ? lastPage[lastPage.length - 1].createdAt
            : undefined; // Use last item timestamp as cursor
        },
        refetchOnWindowFocus: false,
      }
    );
  // console.log(data);
  const users = data?.pages?.flatMap((page) => page);
  const { lastItemRef } = useLastItemObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );

  if (isPrivateLoading) {
    <LoaderScreen message={"Creating conversation"} />;
  }
  // console.log(lastItemRef);
  return (
    <PopupBox
      className={
        "flex flex-col justify-start items-center gap-5 text-center p-4 border-inherit max-w-[30rem] w-full max-h-[60%] shadow-sm"
      }
      action={() => dispatch(setOpenNewConverstionBox())}
    >
      <h1 className=" font-bold text-lg">New Conversation</h1>
      <SearchBar className={"flex w-full p-1 px-2 border rounded-lg"} />
      <Ibutton className={"w-full text"} innerText={" + New group"} />
      <div
        ref={containerRef}
        className="flex flex-col max-h-[20rem] h-full justify-start items-start gap-3 w-full overflow-y-auto listbox"
      >
        {users?.map((Usr, idx, arr) => (
          <PeoplesList
            ref={arr.length % 5 == 0 ? lastItemRef : null}
            className={"flex justify-between items-center w-full"}
            key={Usr.id}
            people={Usr}
            popover={false}
            action={() => PrivateMutaion(Usr?.id)}
          >
            <input
              onChange={() => {}}
              type="checkbox"
              name="userId"
              id={Usr.id}
            />
          </PeoplesList>
        ))}
      </div>
    </PopupBox>
  );
};

export default memo(NewConversation);
