import _ from "lodash";
import queries from "./queries";

module.exports = function fetchUser({ hull, search }) {
  const { groups, email, name } = search;
  const params = (email) ? queries.email(email) : queries.name(name);
  return hull.post("search/user_reports", params)
  .then(({ pagination = {}, data = [] }) => {
    const [user = {}] = data;
    if (!user.id) return Promise.reject();
    return hull.as(user.id).get("/me/segments")
      .then((segments) => { return { segments, pagination, user }; });
  })
  .then(({ segments, pagination, user }) => {
    let groupedUser = hull.utils.groupTraits(_.omitBy(user, v => (v === null || v === "" || v === undefined)));
    return { hull, user: groupedUser, segments, pagination };
  });
};
