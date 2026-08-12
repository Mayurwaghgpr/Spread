import { useMemo } from "react";
import { PopupBox } from "../../components/utilityComp/PopupBox";
import { Link, Outlet, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Info, Image, Users, X } from "lucide-react";

function ConversationInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("Id");

  const sideNav = useMemo(
    () => [
      {
        id: "info",
        linkName: "Details",
        stub: `/messages/c/info?Id=${conversationId}`,
        icon: Info,
      },
      {
        id: "attach",
        linkName: "Media & Files",
        stub: `/messages/c/info/attach?Id=${conversationId}`,
        icon: Image,
      },
      {
        id: "members",
        linkName: "Members",
        stub: `/messages/c/info/members?Id=${conversationId}`,
        icon: Users,
      },
    ],
    [conversationId]
  );

  return (
    <PopupBox
      action={() => navigate(-1)}
      className="flex flex-col sm:flex-row max-w-2xl w-full h-[80vh] sm:h-[75vh] spread-card rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden backdrop-blur-xl animate-in zoom-in-95 duration-150"
    >
      {/* Sidebar Navigation */}
      <aside className="sm:w-56 p-4 border-b sm:border-b-0 sm:border-r border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-800/30 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Chat Info
          </h2>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="sm:hidden p-1 rounded-full text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex sm:flex-col gap-1 overflow-x-auto sm:overflow-x-visible">
          {sideNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname + location.search === item.stub;

            return (
              <Link
                key={item.id}
                to={item.stub}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-nowrap ${
                  isActive
                    ? "spread-card bg-stone-200/80 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 shadow-sm"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/40 dark:hover:bg-stone-800/30"
                }`}
              >
                <Icon className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                <span>{item.linkName}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Detail Panel */}
      <main className="flex-1 overflow-y-auto bg-stone-50/30 dark:bg-stone-950/30 p-4 sm:p-6">
        <Outlet />
      </main>
    </PopupBox>
  );
}

export default ConversationInfo;
