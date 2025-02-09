import { Button } from "@/components/ui/button";
import { useRouter } from "@/hooks/use-router";
import { cn } from "@/lib/utils";
import { Wind } from "lucide-react";

const DEBUG = false;

const HomePage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-screen gap-5",
        {
          "border-2 border-red-500": DEBUG,
        },
      )}
    >
      <div
        className={cn(
          "flex items-center justify-start font-semibold text-xl3",
          {
            "border-2 border-blue-500": DEBUG,
          },
        )}
      >
        <Wind className="w-6 h-6 mr-2" />
        <span className="truncate">Ask Breezy</span>
      </div>
      <div className="max-w-md">
        Ask Breezy is a simple chatbot that allows you to inquire about weather condition for any location in the world in conversational form.
        It uses OpenAI and AccuWeather APIs, and it is built for educational purposes.
      </div>
      <Button onClick={() => navigate("chats")}>Get Started</Button>
    </div>
  );
};

export default HomePage;
