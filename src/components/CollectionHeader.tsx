import React, { FC } from "react";

import { AgentPaylodObj, ArticleType } from "../Models";
export interface CollectionHeaderComponentProps {
  description: string;
  articles: ArticleType[];
  authors: AgentPaylodObj[];
  title: string;
}

const CollectionHeader: FC<CollectionHeaderComponentProps> = (props) => {
  const { description, articles, authors, title } = props;
  return (
    <header className="collection-header">
      <h2 className="title">{title}</h2>
      {description && <p className="desc">{description}</p>}
      <div className="author">
        <p>
          {articles.length} article{articles.length > 1 && "s"} <br />
          By {authors[0].name}{" "}
          {authors.length > 1 &&
            `and ${
              authors.length == 2
                ? authors[1].name
                : `${authors.length - 1} others`
            }`}
        </p>
        <div className="authors">
          {authors.map((author) => {
            return (
              <div className="img-frame">
                <div className="img-container">
                  <img src={author.profile_img_url} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default CollectionHeader;
