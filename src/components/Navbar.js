import {
  HiCalendar,
  HiCheckCircle,
  HiCog,
  HiExclamationCircle,
  HiInbox,
  HiMenu,
  HiSun,
  HiTrash,
} from "react-icons/hi";
import { useView } from "../contexts/ViewContext";
import NavbarItem from "./NavbarItem";
import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../contexts/TaskContext";
import NewListButton from "./NewListButton";
import { listIcons } from "../config/icons";

export default function Navbar() {
  const { userData } = useAuth();
  const { userLists } = useTasks();
  const { navbar, toggleNavbar } = useView();

  // const getLength = (list) => {
  //   return list.tasks.filter((task) => !task.completed).length;
  // };

  const specialLists = ["inbox", "today", "upcoming", "important"];

  return (
    <div
      className={`${
        navbar ? "w-[240px]" : "w-[56px] sm:w-[240px]"
      } absolute box-content flex h-full flex-col border-r-2 border-gray-100 bg-white transition-all sm:relative`}
    >
      <div className="flex h-[56px] w-full flex-none items-center border-b-2 border-gray-100 px-3">
        {/* Account info and seettings */}
        <div
          className={`${!navbar && "hidden sm:grid"} ${
            !userData.photoURL && "bg-accent font-semibold text-white"
          } grid h-8 w-8 flex-none cursor-pointer place-items-center overflow-hidden rounded-lg`}
        >
          {/* Account profile image or placeholder */}
          {userData.photoURL ? (
            <img
              className="h-full w-full"
              src={userData.photoURL}
              alt="pfp"
            ></img>
          ) : (
            userData.displayName[0]
          )}
        </div>
        {/* User account info (name, email) */}
        <div
          className={`${
            !navbar && "hidden sm:block"
          } no-select ml-3 flex-auto truncate text-sm`}
        >
          <p className="truncate font-medium text-gray-700">{`${userData.displayName}`}</p>
          <p className="-mt-1 truncate text-gray-500">{userData.email}</p>
        </div>
        {/* Toggle mobile navbar */}
        <button
          onClick={toggleNavbar}
          className={`grid h-8 w-8 place-items-center text-xl text-gray-500 sm:hidden`}
        >
          <HiMenu />
        </button>
      </div>
      {/* All lists */}
      <div className="sidenav flex-auto space-y-3 overflow-y-auto p-3">
        {/* Default lists */}
        <div>
          <NavbarItem
            icon={<HiInbox />}
            title="Inbox"
            link={"/inbox"}
            // length={getLength(userLists.find((list) => list.id === "inbox"))}
          />
        </div>
        <div className="flex flex-col gap-1">
          <NavbarItem icon={<HiSun />} title="Today" link={"/today"} />
          <NavbarItem
            icon={<HiCalendar />}
            title="Upcoming"
            link={"/upcoming"}
          />
          <NavbarItem
            icon={<HiExclamationCircle />}
            title="Important"
            link={"/important"}
          />
          <NavbarItem
            icon={<HiCheckCircle />}
            title="Completed"
            link={"/completed"}
          />
        </div>
        <div className="flex flex-col gap-1">
          <NavbarItem icon={<HiCog />} title="Settings" link={"/settings"} />
          <NavbarItem
            icon={<HiTrash />}
            title="Recently Deleted"
            link={"/deleted"}
          />
        </div>
        {/* Horizontal divider */}
        <hr className="h-[2px] w-full border-0 bg-gray-100" />
        <div className="flex flex-col gap-1">
          {/* User lists */}
          {userLists
            .filter((list) => !specialLists.includes(list.id)) // Check if its not a default list
            .map((list) => (
              <NavbarItem
                icon={listIcons.find((icon) => icon.name === list.icon).icon}
                key={list.id}
                title={list.title}
                link={`/${list.id}`}
                // length={getLength(list)}
              />
            ))}
          {/* New list button */}
          <NewListButton />
        </div>
      </div>
    </div>
  );
}
