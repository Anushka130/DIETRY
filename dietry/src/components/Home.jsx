import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-[#a7dfa2] py-4 px-5 flex justify-between items-center shadow-md z-[1000]">
        <h1 className="text-[#004D40] text-xl font-bold">DIETRY</h1>
        <button 
          className="bg-white text-[#004D40] py-1.5 px-3 text-sm rounded-lg font-bold cursor-pointer transition-all duration-300 hover:bg-[#f0f0f0] hover:w-[100px] ml-auto"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </header>
      <section className="flex flex-col items-center justify-center text-center mt-[70px]">
        <img src="" alt="" className="hero-image" />
        <div className="hero-content">
          <h2 className="text-2xl text-[#004D40] font-bold">START YOUR FITNESS JOURNEY</h2>
          <p className="text-lg text-gray-600 mt-2.5">Get your personalized meal plan for healthy living</p>
          <button 
            className="bg-[#FF9800] text-white text-lg py-3 px-5 mt-5 rounded-lg hover:bg-[#FB8C00]"
            onClick={() => navigate("/login")}
          >
            GET STARTED
          </button>
        </div>
      </section>
    </>
  );
}