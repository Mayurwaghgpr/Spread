import ThemeBtn from "../../components/buttons/ThemeBtn";
const Modes = [
  {
    name: "Dark mode",
    value: "dark",
    icon: "moonFi",
  },
  {
    name: "Light mode",
    value: "light",
    icon: "sun",
  },
  {
    name: "System",
    value: "system",
    icon: "desktopO",
  },
];
function General() {
  return (
    <section className="flex flex-col  bg-inherit px-3 border-inherit">
      {" "}
      <div className=" flex gap-10  bg-inherit items-center border-inherit">
        <div className="flex justify-between items-center w-full border-inherit">
          {" "}
          <div className="flex flex-col justify-center items-start  border-inherit gap-3">
            <label>Theme</label>
            <ThemeBtn
              className="flex gap-3 *:p-1 text-[10px] bg-gray-50 dark:bg-gray-900 rounded-lg p-1  border-inherit"
              Modes={Modes}
              separate={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default General;
