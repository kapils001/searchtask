const ResultItemCard = ({
  item,
  searchQuery,
  isFocused,
  onMouseEnter,
  onClick,
  onKeyDown,
  onMouseLeave,
}) => {
  const query = searchQuery?.toLowerCase();

  const highlightText = (text) => {
    const index = text.toLowerCase().indexOf(query);
    if (index !== -1) {
      const prefix = text.substring(0, index);
      const suffix = text.substring(index + query.length);
      return (
        <>
          {prefix}
          <span className="textblue">
            {text.substring(index, index + query.length)}
          </span>
          {suffix}
        </>
      );
    } else {
      return text;
    }
  };

  return (
    <div
      className={`result-item-card ${isFocused && "bgYellow"}`}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onMouseLeave={onMouseLeave}
    >
      <div>
        <p className="id">{highlightText(item?.id)}</p>
        <p className="name">{highlightText(item?.name)}</p>
      </div>
      {searchQuery &&
        item?.items?.some((item) =>
          item.toLowerCase().startsWith(searchQuery.toLowerCase())
        ) && (
          <p key={searchQuery}>
            {" "}
            <span className="textblue">{`"${searchQuery}"`}</span> included in
            item
          </p>
        )}
      <p className="address">{highlightText(item?.address)}</p>
    </div>
  );
};

export default ResultItemCard;
