import Link from "next/link";
import { useRouter } from "next/router";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  chakra,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import { supabaseClient } from "../utils/client";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabaseClient.auth.signIn({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        setTimeout(() => {
          setError(null);
          setEmail("");
          setPassword("");
        }, 3000);
      }
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError(null);
        setEmail("");
        setPassword("");
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      py="6"
      px={{ base: "4", lg: "8" }}
      bgGradient="linear(to-tr, #6772E5, rgb(112, 167, 248, 0.58))"
    >
      <Flex
        direction={{ base: "column", sm: "row" }}
        justify="space-between"
        alignItems="center"
        pb={12}
      >
        <Box>
          <Logo />
        </Box>
        <Box>
          <Button
            bg="none"
            color="black"
            borderRadius={2}
            fontSize="md"
            mr={2}
            _hover={{ bg: "purple.500", color: "white" }}
          >
            <Link href="/signup">
              <a>Sign Up</a>
            </Link>
          </Button>
          <Button
            bg={"purple.400"}
            color="white"
            rounded="sm"
            borderRadius={2}
            fontSize="md"
            _hover={{ bg: "purple.500" }}
          >
            <Link href="/signin">
              <a>Sign In</a>
            </Link>
          </Button>
        </Box>
      </Flex>
      <Box maxW="md" mx="auto">
        {error && (
          <Alert status="error" mb="6">
            <AlertIcon />
            <Text textAlign="center">{error}</Text>
          </Alert>
        )}
        <Box
          py="8"
          px={{ base: "4", md: "10" }}
          shadow="base"
          rounded="lg"
          bg="white"
        >
          <chakra.form onSubmit={submitHandler}>
            <Heading textAlign="center" mb={4}>
              Sign In
            </Heading>
            <Stack spacing="6">
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  autoComplete="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button
                type="submit"
                bg="purple.400"
                color="white"
                size="lg"
                fontSize="md"
                isLoading={isLoading}
                _hover={{ bg: "purple.500" }}
              >
                Sign In
              </Button>
            </Stack>
            <Text textAlign={"center"} mt={6}>
              <Link href="/reset">
                <a>
                  <b>Forgot Password?</b>
                </a>
              </Link>
            </Text>
            <Text textAlign={"center"} mt={6}>
              Don&apos;t have an Account?
              <br />
              <Link href="/signup">
                <a>
                  <b>Sign Up</b>
                </a>
              </Link>
            </Text>
          </chakra.form>
        </Box>
      </Box>
    </Box>
  );
};

const Logo = () => (

    <svg
      width="327"
      height="69"
      viewBox="0 0 327 69"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M63.8367 48.0485C65.2083 48.4149 66.635 47.5946 67.0015 46.2229L68.5676 40.3701C68.9373 38.9985 68.1137 37.5717 66.7421 37.2053C63.8561 36.2812 61.7614 33.7779 61.3658 30.772C60.9702 27.7661 62.3451 24.8056 64.8938 23.1649C66.1227 22.4547 66.5507 20.8659 65.8406 19.6337L62.812 14.3872C62.1019 13.155 60.513 12.7302 59.2809 13.4403C56.5863 14.8282 53.3339 14.5363 50.9312 12.6945C48.5284 10.8495 47.4032 7.78201 48.0485 4.82153C48.4149 3.44991 47.5945 2.02317 46.2197 1.65676L40.3701 0.0873419C38.9984 -0.279071 37.5717 0.541305 37.2053 1.91292C36.2811 4.79883 33.7779 6.89354 30.772 7.28914C27.7693 7.68474 24.8056 6.30988 23.1649 3.7612C22.4547 2.52901 20.8659 2.10423 19.6337 2.81436L14.3872 5.84294C13.1582 6.55307 12.7302 8.14194 13.4403 9.37088C14.8282 12.0655 14.5396 15.3178 12.6945 17.7238C10.8495 20.1266 7.782 21.2517 4.82151 20.6065C3.4499 20.2368 2.02316 21.0604 1.65674 22.432L0.0873283 28.2849C-0.279085 29.6565 0.541291 31.0833 1.91615 31.4497C4.80206 32.3738 6.89677 34.8804 7.29237 37.883C7.68797 40.8856 6.31311 43.8494 3.76443 45.4901C2.53224 46.2002 2.10746 47.7891 2.81759 49.0181L5.84617 54.2646C6.5563 55.4968 8.14517 55.9215 9.37411 55.2114C12.0687 53.8236 15.321 54.1122 17.727 55.9572C20.1298 57.8022 21.255 60.8697 20.6097 63.8302C20.2433 65.2018 21.0637 66.6286 22.4353 66.995L28.2882 68.5644C29.6598 68.9308 31.0865 68.1104 31.4529 66.7356C32.3771 63.8497 34.8836 61.755 37.8862 61.3594C40.8889 60.9638 43.8526 62.3386 45.4901 64.8873C46.2002 66.1195 47.7891 66.5443 49.0213 65.8341L54.2678 62.8056C55.5 62.0954 55.9248 60.5066 55.2146 59.2776C53.8268 56.583 54.1186 53.3307 55.9604 50.9247C57.8055 48.5219 60.873 47.3968 63.8335 48.042L63.8367 48.0485ZM14.8735 29.1183L14.8962 29.0307L14.9189 28.9432L14.9449 28.8556L14.9708 28.7681L14.9968 28.6805L15.0227 28.593L15.0486 28.5054L15.0746 28.4179L15.1005 28.3303L15.1265 28.2428L15.1524 28.1552L15.1816 28.0709L15.2108 27.9866L15.24 27.9023L15.2691 27.818L15.2983 27.7337L15.3275 27.6494L15.3599 27.5651L15.3891 27.4808L15.4183 27.3965L15.4507 27.3121L15.4832 27.2278L15.5156 27.1435L15.548 27.0592C15.5707 27.0041 15.5902 26.949 15.6129 26.8939L15.6453 26.8095L15.6777 26.7285L15.7101 26.6474L15.7426 26.5664L15.775 26.4853C15.7977 26.4302 15.8204 26.375 15.8463 26.3232L15.882 26.2421C15.9047 26.187 15.9306 26.1351 15.9533 26.08L15.989 25.9989L16.0247 25.9178L16.0636 25.8368C16.0863 25.7849 16.1122 25.7298 16.1382 25.6779L16.1771 25.6001L16.216 25.5222L16.2549 25.4444L16.2938 25.3666L16.3327 25.2888L16.3716 25.2109L16.4105 25.1331L16.4527 25.0553L16.4916 24.9775C16.5338 24.8997 16.5727 24.8218 16.6148 24.7473C16.644 24.6954 16.6699 24.6435 16.6991 24.5949L16.7413 24.517L16.7834 24.4425C16.8126 24.3906 16.8418 24.3419 16.8677 24.2901L16.9131 24.2155L16.9585 24.1409L17.0039 24.0663L17.0493 23.9917L17.0947 23.9172C17.8697 22.6363 18.7776 21.456 19.7958 20.3989C22.4385 17.6525 25.8173 15.7004 29.5171 14.786C30.9438 14.4326 32.4192 14.2348 33.9173 14.2056C35.7721 14.1699 37.6625 14.3872 39.5432 14.893C41.4239 15.3956 43.1717 16.1511 44.7605 17.111C46.0413 17.8859 47.2216 18.7939 48.2787 19.812C51.0252 22.4547 52.9772 25.8335 53.8917 29.5333C54.2451 30.9601 54.4429 32.4354 54.4721 33.9335V34.0211V34.1086V34.1962V34.2837V34.3713V34.5464V34.6339L54.4688 34.7215L54.4656 34.8966C54.4624 34.9841 54.4591 35.0717 54.4559 35.1592L54.4526 35.2468L54.4494 35.3343L54.4461 35.4219L54.4397 35.5094L54.4332 35.597L54.4267 35.6845L54.4202 35.7721L54.4137 35.8596L54.4072 35.9472C54.4007 36.0055 54.3975 36.0639 54.391 36.1223L54.3813 36.2098L54.3716 36.2974L54.3618 36.3849C54.3553 36.4433 54.3489 36.5017 54.3424 36.56L54.3327 36.6476L54.3229 36.7351L54.31 36.8227L54.3002 36.9102L54.2873 36.9978L54.2743 37.0853L54.2613 37.1729L54.2483 37.2604C54.2386 37.3188 54.2289 37.3772 54.2224 37.4355L54.2094 37.5231L54.1965 37.6106L54.1802 37.6982L54.164 37.7857L54.1478 37.8733L54.1316 37.9608L54.1154 38.0484L54.0992 38.1359L54.083 38.2235L54.0668 38.311L54.0473 38.3986L54.0278 38.4861L54.0084 38.5737L53.9889 38.6612L53.9695 38.7488L53.95 38.8363L53.9306 38.9239L53.9111 39.0114L53.8884 39.099L53.8657 39.1865L53.843 39.2741L53.8203 39.3616L53.7976 39.4492L53.7749 39.5367L53.7522 39.6243L53.7295 39.7118L53.7068 39.7994L53.6809 39.8869L53.655 39.9745L53.629 40.062L53.6031 40.1496L53.5771 40.2371L53.5512 40.3247L53.5253 40.409L53.4961 40.4965L53.4701 40.5808L53.4409 40.6651L53.4118 40.7495L53.3826 40.837L53.3534 40.9213L53.3242 41.0056L53.295 41.0899L53.2658 41.1742L53.2334 41.2585L53.201 41.3428L53.1686 41.4272L53.1361 41.5115L53.1037 41.5958C53.081 41.6509 53.0616 41.706 53.0389 41.7611L53.0064 41.8422L52.974 41.9265L52.9416 42.0108L52.9092 42.0919L52.8767 42.1729L52.8411 42.254L52.8054 42.3351L52.7697 42.4161C52.747 42.468 52.7243 42.5231 52.6984 42.5783L52.6627 42.6593L52.6271 42.7404L52.5914 42.8215C52.5654 42.8733 52.5395 42.9285 52.5168 42.9804L52.4779 43.0614L52.439 43.1392L52.4001 43.2171L52.3612 43.2949L52.3222 43.3727L52.2833 43.4505L52.2444 43.5283L52.2023 43.6062L52.1634 43.684C52.1244 43.7618 52.0823 43.8396 52.0401 43.9175C52.011 43.9693 51.985 44.0212 51.9558 44.0699L51.9137 44.1444L51.8715 44.219C51.8423 44.2709 51.8132 44.3195 51.7872 44.3714L51.7418 44.446L51.6964 44.5206L51.651 44.5952L51.6056 44.6697L51.5602 44.7443C50.7853 46.0251 49.8773 47.2022 48.8592 48.2625C46.2164 51.009 42.8377 52.9611 39.1379 53.8755C37.7111 54.2289 36.239 54.4267 34.7409 54.4559C32.8861 54.4948 30.9957 54.2743 29.115 53.7685C27.2343 53.2626 25.4866 52.5103 23.8977 51.5505C22.6169 50.7755 21.4366 49.8676 20.3795 48.8494C17.633 46.2067 15.681 42.828 14.7665 39.1282C14.4131 37.7014 14.2153 36.226 14.1861 34.728V34.6404V34.5529V34.4653V34.2902C14.1861 34.2318 14.1861 34.1735 14.1861 34.1151V34.0276L14.1894 33.94C14.1894 33.8816 14.1894 33.8233 14.1926 33.7649C14.1958 33.6774 14.1991 33.5898 14.2023 33.5023L14.2056 33.4147L14.2088 33.3272L14.2153 33.2396L14.2185 33.1521L14.225 33.0645L14.2315 32.977L14.238 32.8894L14.2445 32.8019L14.251 32.7143C14.2575 32.6559 14.2607 32.5976 14.2672 32.5392L14.2737 32.4517L14.2834 32.3641L14.2931 32.2766C14.2996 32.2182 14.3061 32.1598 14.3126 32.1015L14.3223 32.0139C14.3288 31.9555 14.3353 31.8972 14.345 31.8388L14.3547 31.7513L14.3677 31.6637L14.3807 31.5762L14.3936 31.4886L14.4066 31.4011C14.4163 31.3427 14.4228 31.2843 14.4326 31.226L14.4455 31.1384L14.4585 31.0509L14.4747 30.9633L14.4909 30.8758L14.5071 30.7882L14.5234 30.7007L14.5396 30.6131L14.5558 30.5256L14.572 30.438L14.5882 30.3505L14.6077 30.2629L14.6271 30.1754L14.6466 30.0878L14.666 30.0003L14.6855 29.9127L14.7049 29.8252L14.7276 29.7376L14.7471 29.6501L14.7698 29.5625L14.7925 29.475L14.8152 29.3874L14.8379 29.2999L14.8606 29.2123L14.8833 29.1248L14.8735 29.1183Z"
        fill="#5E17EB"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M44.9495 25.0595L46.7297 23.2793C44.7322 21.3954 42.2549 19.9654 39.4176 19.2034C30.2897 16.7585 20.9057 22.1736 18.4575 31.3048C18.2305 32.1543 18.0684 33.0071 17.9744 33.8567C20.4096 24.8358 29.6931 19.4888 38.7205 21.9077C41.0681 22.5368 43.1661 23.6295 44.9463 25.0595H44.9495Z"
        fill="#D9D9D9"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M37.7673 37.2257C40.3613 35.8671 44.1 31.7068 48.9866 24.745C41.6486 28.7139 37.1187 31.8982 35.3872 34.3009C33.594 36.7945 35.0305 38.659 37.7673 37.2257Z"
        fill="#D9D9D9"
      />
      <path
        d="M84.7608 30.8656H78.1186V26.9514H96.2066V30.8656H89.5645V47.7082H84.7608V30.8656ZM98.1176 31.7551H102.743V47.7082H98.1176V31.7551ZM100.43 29.5312C99.5805 29.5312 98.8886 29.2841 98.3548 28.7899C97.8211 28.2957 97.5542 27.6829 97.5542 26.9514C97.5542 26.22 97.8211 25.6072 98.3548 25.113C98.8886 24.6188 99.5805 24.3717 100.43 24.3717C101.281 24.3717 101.972 24.6089 102.506 25.0833C103.04 25.5578 103.307 26.1508 103.307 26.8625C103.307 27.6334 103.04 28.2759 102.506 28.7899C101.972 29.2841 101.281 29.5312 100.43 29.5312ZM127.467 31.5179C129.464 31.5179 131.045 32.111 132.211 33.2971C133.398 34.4634 133.991 36.2228 133.991 38.5752V47.7082H129.365V39.2869C129.365 38.0217 129.098 37.0827 128.564 36.4699C128.05 35.8373 127.309 35.521 126.34 35.521C125.253 35.521 124.393 35.8768 123.761 36.5885C123.128 37.2804 122.812 38.3182 122.812 39.702V47.7082H118.186V39.2869C118.186 36.7763 117.178 35.521 115.161 35.521C114.094 35.521 113.244 35.8768 112.611 36.5885C111.979 37.2804 111.662 38.3182 111.662 39.702V47.7082H107.037V31.7551H111.455V33.5936C112.048 32.9215 112.769 32.4075 113.619 32.0517C114.489 31.6958 115.438 31.5179 116.466 31.5179C117.593 31.5179 118.611 31.7453 119.52 32.1999C120.43 32.6348 121.161 33.2773 121.715 34.1273C122.367 33.2971 123.187 32.6546 124.176 32.1999C125.184 31.7453 126.281 31.5179 127.467 31.5179ZM153.938 39.791C153.938 39.8503 153.908 40.2654 153.849 41.0364H141.78C141.997 42.0248 142.511 42.8056 143.322 43.3789C144.132 43.9522 145.141 44.2388 146.346 44.2388C147.177 44.2388 147.908 44.1202 148.541 43.883C149.193 43.626 149.796 43.2307 150.35 42.6969L152.811 45.3656C151.308 47.0855 149.114 47.9454 146.228 47.9454C144.429 47.9454 142.838 47.5995 141.454 46.9076C140.07 46.1959 139.003 45.2174 138.251 43.972C137.5 42.7266 137.125 41.3131 137.125 39.7317C137.125 38.17 137.49 36.7664 138.222 35.521C138.973 34.2558 139.991 33.2773 141.276 32.5854C142.581 31.8738 144.034 31.5179 145.635 31.5179C147.197 31.5179 148.61 31.854 149.875 32.5261C151.14 33.1982 152.129 34.1669 152.84 35.4321C153.572 36.6775 153.938 38.1304 153.938 39.791ZM145.664 35.0169C144.617 35.0169 143.737 35.3134 143.025 35.9065C142.314 36.4995 141.879 37.31 141.721 38.338H149.579C149.42 37.3298 148.986 36.5292 148.274 35.9361C147.562 35.3233 146.692 35.0169 145.664 35.0169ZM170.041 30.8656H163.399V26.9514H181.487V30.8656H174.844V47.7082H170.041V30.8656ZM187.816 33.8605C188.369 33.0895 189.111 32.5063 190.04 32.111C190.989 31.7156 192.076 31.5179 193.301 31.5179V35.7879C192.787 35.7483 192.442 35.7286 192.264 35.7286C190.939 35.7286 189.901 36.1042 189.15 36.8554C188.399 37.5868 188.023 38.6938 188.023 40.1765V47.7082H183.397V31.7551H187.816V33.8605ZM202.4 31.5179C204.871 31.5179 206.768 32.111 208.093 33.2971C209.417 34.4634 210.08 36.2327 210.08 38.6049V47.7082H205.75V45.7215C204.881 47.2041 203.26 47.9454 200.887 47.9454C199.662 47.9454 198.594 47.7378 197.685 47.3227C196.795 46.9076 196.113 46.3343 195.639 45.6029C195.164 44.8714 194.927 44.0412 194.927 43.1121C194.927 41.6294 195.481 40.4631 196.588 39.6131C197.715 38.763 199.444 38.338 201.777 38.338H205.454C205.454 37.3298 205.147 36.5589 204.535 36.0251C203.922 35.4716 203.003 35.1948 201.777 35.1948C200.927 35.1948 200.087 35.3332 199.256 35.61C198.446 35.867 197.754 36.2228 197.181 36.6775L195.52 33.4453C196.39 32.8325 197.428 32.3581 198.634 32.022C199.859 31.686 201.115 31.5179 202.4 31.5179ZM202.044 44.8319C202.835 44.8319 203.536 44.654 204.149 44.2982C204.762 43.9226 205.197 43.3789 205.454 42.6673V41.0364H202.281C200.383 41.0364 199.434 41.6591 199.434 42.9045C199.434 43.4975 199.662 43.972 200.116 44.3278C200.591 44.6639 201.233 44.8319 202.044 44.8319ZM222.15 47.9454C220.45 47.9454 218.917 47.5995 217.553 46.9076C216.209 46.1959 215.152 45.2174 214.381 43.972C213.629 42.7266 213.254 41.3131 213.254 39.7317C213.254 38.1502 213.629 36.7368 214.381 35.4914C215.152 34.246 216.209 33.2773 217.553 32.5854C218.917 31.8738 220.45 31.5179 222.15 31.5179C223.83 31.5179 225.293 31.8738 226.538 32.5854C227.803 33.2773 228.723 34.2756 229.296 35.5803L225.708 37.5077C224.878 36.0449 223.682 35.3134 222.12 35.3134C220.914 35.3134 219.916 35.7088 219.125 36.4995C218.334 37.2903 217.939 38.3677 217.939 39.7317C217.939 41.0957 218.334 42.1731 219.125 42.9638C219.916 43.7545 220.914 44.1499 222.12 44.1499C223.701 44.1499 224.897 43.4185 225.708 41.9556L229.296 43.9127C228.723 45.1778 227.803 46.1663 226.538 46.8779C225.293 47.5896 223.83 47.9454 222.15 47.9454ZM247.383 39.791C247.383 39.8503 247.354 40.2654 247.294 41.0364H235.226C235.443 42.0248 235.957 42.8056 236.768 43.3789C237.578 43.9522 238.587 44.2388 239.792 44.2388C240.623 44.2388 241.354 44.1202 241.987 43.883C242.639 43.626 243.242 43.2307 243.795 42.6969L246.257 45.3656C244.754 47.0855 242.56 47.9454 239.674 47.9454C237.875 47.9454 236.283 47.5995 234.9 46.9076C233.516 46.1959 232.448 45.2174 231.697 43.972C230.946 42.7266 230.57 41.3131 230.57 39.7317C230.57 38.17 230.936 36.7664 231.668 35.521C232.419 34.2558 233.437 33.2773 234.722 32.5854C236.027 31.8738 237.479 31.5179 239.081 31.5179C240.642 31.5179 242.056 31.854 243.321 32.5261C244.586 33.1982 245.575 34.1669 246.286 35.4321C247.018 36.6775 247.383 38.1304 247.383 39.791ZM239.11 35.0169C238.063 35.0169 237.183 35.3134 236.471 35.9065C235.76 36.4995 235.325 37.31 235.167 38.338H243.024C242.866 37.3298 242.431 36.5292 241.72 35.9361C241.008 35.3233 240.138 35.0169 239.11 35.0169ZM254.881 33.8605C255.435 33.0895 256.176 32.5063 257.105 32.111C258.054 31.7156 259.141 31.5179 260.367 31.5179V35.7879C259.853 35.7483 259.507 35.7286 259.329 35.7286C258.005 35.7286 256.967 36.1042 256.216 36.8554C255.464 37.5868 255.089 38.6938 255.089 40.1765V47.7082H250.463V31.7551H254.881V33.8605Z"
        fill="#5E17EB"
      />
    </svg>

)

export default SignIn;
