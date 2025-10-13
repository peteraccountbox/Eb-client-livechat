import React, { FC, UIEvent, useContext, useEffect, useState } from "react";

import {
  HC_ACTIVE_ID,
  HC_ACTIVE_COMPONENT,
  KB_ARTICLE_URL_PATH,
} from "../globals";
import { PromtWidth, widgetFooterTabs } from "../App";
import { AppContext } from "../appContext";
import { getReq } from "../request";
import { getSessionStoragePrefs, removeSessionStoragePrefs } from "../Storage";
import CloseWidgetPanel from "./CloseWidgetPanel";
import { resizeFrame } from "../Utils";
import { AgentPaylodObj, ArticleType } from "../Models";

export interface ArticleComponentProps {
  articleId: Number | undefined;
  backToCollection: (collectionId: Number | null) => void;
}

const Article: FC<ArticleComponentProps> = (props) => {
  const titleRef = React.useRef<HTMLDivElement>(null);
  const parentContext = useContext(AppContext);
  const setPromtWidth = parentContext.setPromtWidth;
  const promtWidth = parentContext.promtWidth;
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState({} as AgentPaylodObj);
  const [article, setArticle] = useState<ArticleType>({} as ArticleType);
  const { articleId, backToCollection } = props;

  const back = () => {
    setPromtWidth(PromtWidth.Small);
    backToCollection(article ? article.collection_id : null);
  };

  const handleScroll = (e: UIEvent) => {
    const target = e.target as HTMLElement;
    if (titleRef.current) {
      if (target.scrollTop > titleRef.current.scrollHeight + 20) {
        titleRef.current.style.opacity = "1";
      } else titleRef.current.style.opacity = "0";
    }
  };

  useEffect(() => {
    // setPromtWidth(PromtWidth.Large);
    var id = articleId ? articleId : getSessionStoragePrefs(HC_ACTIVE_ID);
    const wait = getReq(KB_ARTICLE_URL_PATH + id, {});
    wait
      .then((response) => {
        // setPromtWidth(PromtWidth.Large);

        if (!response.data || !response.data.id) {
          removeSessionStoragePrefs(HC_ACTIVE_COMPONENT);
          removeSessionStoragePrefs(HC_ACTIVE_ID);
          parentContext.changeActiveTab(widgetFooterTabs.Help);
        }

        setArticle(response.data);
        setAuthor(response.data.owner);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }, []);

  return (
    <div className="overflow___hiiden">
      <div className="chat__help chat__help-article">
        {!loading ? (
          <div className="chat__conversation chat__create-ticket">
            <div className="chat__header chat__help__article-header">
              <div className="ticket__header-action">
                <div
                  data-trigger="all"
                  className="chat__header-back chat__header-icon"
                  onClick={back}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    color="currentColor"
                  >
                    <path
                      stroke="#fff"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.7"
                      d="m14 18-6-6 6-6"
                    ></path>
                  </svg>
                </div>
                <div className="chat__header-user">
                  <h3
                    className={`chat__header-user-name ${
                      article.title ? "article-header" : ""
                    }`}
                    ref={titleRef}
                  >
                    {article.title}
                  </h3>
                </div>
                <div
                  data-trigger="all"
                  className="chat__header-toggle-expansion"
                >
                  <div
                    className="chat__header-icon chat__header-expand-icon"
                    onClick={() => {
                      resizeFrame(
                        promtWidth && promtWidth == PromtWidth.Large
                          ? "WINDOW_OPENED"
                          : "WINDOW_OPENED_LARGE"
                      );
                      setPromtWidth(
                        promtWidth == PromtWidth.Large
                          ? PromtWidth.Small
                          : PromtWidth.Large
                      );
                    }}
                  >
                    {promtWidth == PromtWidth.Large ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="expanded-svg"
                      >
                        <path
                          d="M1 1.00073L6 6.00073"
                          stroke="#ffffff"
                          stroke-width="1.7"
                        ></path>
                        <path
                          d="M1.5 6.50073L6.5 6.50073L6.5 1.50073"
                          stroke="#ffffff"
                          stroke-width="1.75"
                        ></path>
                        <path
                          d="M10 10.0017L15 15.0017"
                          stroke="#ffffff"
                          stroke-width="1.75"
                        ></path>
                        <path
                          d="M9.5 14.5017L9.5 9.50171L14.5 9.50171"
                          stroke="#ffffff"
                          stroke-width="1.75"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="expand-svg"
                      >
                        <path
                          d="M1.99902 2.00073L6.99903 7.00073"
                          stroke="#fff"
                          stroke-width="1.7"
                        ></path>
                        <path
                          d="M6.49902 1.50073L1.49902 1.50073L1.49902 6.50073"
                          stroke="#fff"
                          stroke-width="1.75"
                        ></path>
                        <path
                          d="M8.99902 9.00074L13.999 14.0007"
                          stroke="#fff"
                          stroke-width="1.75"
                        ></path>
                        <path
                          d="M14.499 9.50073L14.499 14.5007L9.49902 14.5007"
                          stroke="#fff"
                          stroke-width="1.75"
                        ></path>
                      </svg>
                    )}
                  </div>
                  <CloseWidgetPanel />
                </div>
              </div>
            </div>

            <div
              onScroll={handleScroll}
              className="help__collections help__collections-article"
            >
              <div className="articlePage">
                <div className="header">
                  <h1 className="title">{article.title}</h1>
                </div>
                <div className="body">
                  <div className="desc">
                    <p>{article.description}</p>
                    <div className="avatar">
                      <div
                        className="avatar-img chat__all-messages-item-profile"
                        style={{
                          backgroundImage:
                            'url("' + author.profile_image_url + '")',
                        }}
                      ></div>
                      <div className="avatar__info">
                        <span>
                          <div>Written by {author.name}</div>
                          {article.updated_time ? (
                            <div>
                              Updated over{" "}
                              {/* <ReactTimeAgo
                                date={article.updated_time * 1000}
                                locale="en-US"
                                tooltip={false}
                              /> */}
                            </div>
                          ) : (
                            <div>
                              Posted over{" "}
                              {/* <ReactTimeAgo
                                date={article.created_time * 1000}
                                locale="en-US"
                                tooltip={false}
                              /> */}
                            </div>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <article
                    dangerouslySetInnerHTML={{ __html: article.content }}
                    className="article"
                  ></article>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="pad-content">
            {" "}
            <div className="chat__form-loader1">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Article;
