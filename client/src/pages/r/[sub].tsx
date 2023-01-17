import React, {
  ChangeEvent,
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import { Sub } from "../../common/types";
import Image from "next/image";
import { useAuthState } from "../../provider/auth";

function SubPage() {
  const [ownSub, setOwnSub] = useState(false);
  const { authenticated, user } = useAuthState();
  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (e: any) {
      console.log(e);
      throw e.response.data;
    }
  };
  const router = useRouter();
  const subName = router.query.sub;
  const {
    data: sub,
    error,
    isLoading,
    isValidating,
  } = useSWR<Sub>(subName ? `/subs/${subName}` : null, fetcher);

  useEffect(() => {
    if (authenticated && user?.username == sub?.username) setOwnSub(true);
  }, [sub]);
  const fileInputRef = useRef<HTMLInputElement>(null); //특정 DOM 선택
  const openFileInput = (type: string) => {
    if (!ownSub) return;
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.name = type;
      fileInput.click();
    }
  };
  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) return;
    const file = e.target.files[0];
    const formData = new FormData();
    console.log("file", file);
    formData.append("file", file);
    formData.append("type", fileInputRef.current!.name);
    try {
      await axios.post(`/subs/${sub?.name}/upload`, formData, {
        headers: { "Context-Type": "multipart/form-data" },
      });
    } catch (e) {
      console.log(e);
    }
  };
  if (isLoading) return <div>isLoading</div>;
  if (isValidating) return <div>isValidating</div>;
  return (
    <div>
      {sub && (
        <Fragment>
          <div className="">
            <input
              type="file"
              hidden={true}
              ref={fileInputRef}
              onChange={uploadImage}
            ></input>
            {/*배너 이미지 */}
            <div className="bg-gray-400">
              {sub.bannerUrn ? (
                <div
                  className={`h-56 bg-no-repeat bg-cover bg-center ${
                    ownSub ? "cursor-pointer" : ""
                  }`}
                  style={{
                    backgroundImage: `url${sub.bannerUrl}`,
                  }}
                  onClick={() => openFileInput("banner")}
                ></div>
              ) : (
                <div
                  className={`h-56 bg-gray-400 ${
                    ownSub ? "cursor-pointer" : ""
                  }`}
                  onClick={() => openFileInput("banner")}
                ></div>
              )}
            </div>
            {/* 커뮤니티 메타 데이터*/}
            <div className="h-20 bg-white">
              <div className="relative flex max-w-5xl px-5 mx-auto">
                <div
                  className={`absolute ${ownSub ? "cursor-pointer" : ""}`}
                  style={{ top: -15 }}
                >
                  {sub.imageUrl && (
                    <Image
                      src={sub.imageUrl}
                      alt=""
                      width={70}
                      height={70}
                      onClick={() => openFileInput("image")}
                      className="rounded-full"
                    ></Image>
                  )}
                </div>
                <div className="pt-1 pl-24">
                  <div className="flex items-center">
                    <h1 className="mb-1 text-3xl font-bold">{sub.title}</h1>
                  </div>
                  <p className="text-sm font-bold text-gray-400">
                    /r/{sub.name}
                  </p>
                </div>
              </div>
            </div>
            {/*Posts & Sidebar */}
            <div className="flex max-w-5xl px-4 pt-5 mx-auto"></div>
          </div>
        </Fragment>
      )}
    </div>
  );
}

export default SubPage;
