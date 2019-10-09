import _ from "lodash";
const baseUrl = "https://www.googleapis.com/";
const querystring = require("querystring");
class ImageSearch {
  constructor(cseId, apiKey) {
    this.cseId = cseId;
    this.apiKey = apiKey;
    if (!this.cseId || !this.apiKey) {
      throw new Error("Api Key Or CSE ID is required!");
    }
  }

  async search(query, options = {}) {
    if (!query || typeof query !== "string") {
      throw new Error("Expected a query in string format!");
    }
    const response = await fetch(
      baseUrl + "customsearch/v1?" + this.getOptions(query, options, this)
    );
    const { items } = await response.json();
    return (items || []).map(item => {
      return {
        ...item.image,
        src: item.link,
        thumbnail: item.image.thumbnailLink,
        isSelected: false,
        caption: item.title
      };
    });
  }

  getOptions(query, options, context) {
    let result = {
      q: query.replace(/\s/g, "+"),
      searchType: "image",
      cx: context.cseId,
      key: context.apiKey,
      imgSize: 'xxlarge'
    };
    if (options.page) {
      result.start = options.page;
    }
    if (options.num) {
      result.num = options.num;
    }

    return querystring.stringify(result);
  }
}

export default ImageSearch;
