import {
  Dashboard,
  ViewKanban,
  Groups,
  History,
  Settings,
  Logout,
} from "@mui/icons-material";

const Sidebar = ({ open }) => {
  const menuItems = [
    {
      name: "Dashboard",
      icon: <Dashboard />,
    },
    {
      name: "My Boards",
      icon: <ViewKanban />,
    },
    {
      name: "Members",
      icon: <Groups />,
    },
    {
      name: "Activity",
      icon: <History />,
    },
    {
      name: "Settings",
      icon: <Settings />,
    },
  ];

  return (
    <aside
      className={`
        min-h-[calc(100vh-72px)]
        bg-white
        border-r
        border-gray-200
        flex
        flex-col
        transition-all
        duration-300
        ease-in-out
        ${open ? "w-64" : "w-[72px]"}
      `}
    >

      {/* Navigation */}
      <div className="px-3 py-6">

        {open && (
          <p className="px-3 mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Workspace
          </p>
        )}

        <nav className="space-y-2">

          {menuItems.map((item, index) => (
            <button
              key={item.name}
              className={`
                w-full
                flex
                items-center
                ${open ? "gap-3 px-3" : "justify-center"}
                py-3
                rounded-xl
                transition-all
                duration-200

                ${
                  index === 0
                    ? "bg-[#A9744F] text-white shadow-sm"
                    : "text-[#5F5A55] hover:bg-[#A9744F]/10 hover:text-[#A9744F]"
                }
              `}
            >

              <span className="flex-shrink-0">
                {item.icon}
              </span>

              {open && (
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.name}
                </span>
              )}

            </button>
          ))}

        </nav>
      </div>

      {/* Bottom */}
      <div className="mt-auto p-3 border-t border-gray-100">

        <button
          className={`
            w-full
            flex
            items-center
            ${open ? "gap-3 px-3" : "justify-center"}
            py-3
            rounded-xl
            text-[#5F5A55]
            hover:bg-red-50
            hover:text-red-500
            transition-all
            duration-200
          `}
        >

          <Logout className="flex-shrink-0" />

          {open && (
            <span className="text-sm font-medium">
              Logout
            </span>
          )}

        </button>

      </div>

    </aside>
  );
};

export default Sidebar;