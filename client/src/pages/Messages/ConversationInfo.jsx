import React, { useMemo } from "react";
import { PopupBox } from "../../component/utilityComp/PopupBox";
import {
  Link,
  Outlet,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import useIcons from "../../hooks/useIcons";

function ConversationInfo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("Id");
  const { isGroup, conversationData } = useOutletContext();
  const icons = useIcons();
  const sideNav = useMemo(
    () => [
      {
        id: uuidv4(),
        linkName: "Info",
        stub: `?Id=${conversationId}`,
        icon: "info",
      }, //default to
      {
        id: uuidv4(),
        linkName: "Attachments",
        stub: `attach?Id=${conversationId}`,
        icon: "image1",
      },
      {
        id: uuidv4(),
        linkName: "Members",
        stub: `members?Id=${conversationId}`,
        icon: "people",
      },
    ],
    [conversationId]
  );

  return (
    <PopupBox action={() => navigate(-1)} className={"flex w-[60%] h-[70%] "}>
      <aside className="border-e w-1/3 p-4">
        <ul className="flex flex-col justify-start items-start gap-1">
          {sideNav.map((conf) => {
            // console.log(conf.id);
            return (
              <Link
                className="flex justify-start items-center gap-2 w-full rounded-lg p-2 hover:bg-black dark:hover:bg-opacity-50 dark:hover:bg-white hover:bg-opacity-[0.06]"
                key={conf.id}
                to={conf.stub}
              >
                {icons[conf.icon]}
                {conf.linkName}
              </Link>
            );
          })}
        </ul>
      </aside>
      <Outlet context={{ isGroup, conversationData }} />
    </PopupBox>
  );
}

export default ConversationInfo;
