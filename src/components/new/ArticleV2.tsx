import React, { FC, UIEvent, useEffect, useState } from "react";
import { getReq } from "../../request";
import { KB_ARTICLE_GET_PATH } from "../../globals";
import { AgentPaylodObj, ArticleType } from "../../Models";
import TimeAgo from "../TimeAgo";

export interface ArticleV2Props {
  articleId: string;
  onBackClick: () => void;
}

const ArticleV2: FC<ArticleV2Props> = ({ articleId, onBackClick }) => {
  const titleRef = React.useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState({} as AgentPaylodObj);
  const [article, setArticle] = useState<ArticleType>({} as ArticleType);

  const handleScroll = (e: UIEvent) => {
    const target = e.target as HTMLElement;
    if (titleRef.current) {
      if (target.scrollTop > titleRef.current.scrollHeight + 20) {
        titleRef.current.style.opacity = "1";
      } else titleRef.current.style.opacity = "0";
    }
  };

  useEffect(() => {
    setLoading(true);

    // Fetch article data
    const endpoint = `${KB_ARTICLE_GET_PATH}/${articleId}`;

    getReq(endpoint, {})
      .then((response) => {
        if (response && response.data) {
          setArticle(response.data);
          setAuthor(response.data.owner || {});
        }
        setLoading(false);
      })
      .catch((e) => {
        console.log("Error fetching article:", e);
        setLoading(false);
      });
  }, [articleId]);

  return (
    <div className="article-v2-container">
      <div className="chat__help chat__help-article">
        {!loading ? (
          <div className="chat__conversation">
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
                    {author && author.name && (
                      <div className="avatar">
                        <div
                          className="avatar-img chat__all-messages-item-profile"
                          style={{
                            backgroundImage: author.profile_img_url
                              ? `url("${author.profile_img_url}")`
                              : "none",
                          }}
                        ></div>
                        <div className="avatar__info">
                          <span>
                            <div>Written by {author.name}</div>
                            {article.updated_time ? (
                              <div>
                                Updated over{" "}
                                <TimeAgo date={article.updated_time * 1000} />
                              </div>
                            ) : (
                              <div>
                                Posted over{" "}
                                <TimeAgo date={article.created_time * 1000} />
                              </div>
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {article.content && (
                    <article
                      dangerouslySetInnerHTML={{ __html: article.content }}
                      className="article"
                    ></article>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="pad-content">
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

export default ArticleV2;
