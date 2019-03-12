// @flow
import {useState, useEffect} from 'react';

export default function useUpdateForm({
  provider,
  schema,
  routes,
  isUpdateForm
}: {
  provider: Object,
  schema: Object,
  routes: Array<string>,
  isUpdateForm: boolean
}) {
  const [result, setResult] = useState({data: {}, rootValue: {}});
  const [isFetching, setIsFetching] = useState(true);
  const getMapValue = () => provider.fetch(routes[0]);
  const getListValue = () => {
    return provider.updateQuery(routes.slice(0, 1), {where: {id: routes[1]}})
      .then(() => {
        return provider.fetch(routes[0]);
      });
  }
  const subscribeListValue = () => provider.subscribe(routes[0], (result) => {
    setResult(result);
  });
  useEffect(() => {
    if (!isUpdateForm) {
      return;
    }

    if (schema[routes[0]].type === 'array') {
      // list
      getListValue()
        .then(result => {
          setResult(result);
          setIsFetching(false);
        });
    } else {
      // map
      getMapValue()
        .then(result => {
          setResult(result);
          setIsFetching(false);
        });
    }
    const {unsubscribe} = subscribeListValue();
    return unsubscribe;
  }, [isUpdateForm, JSON.stringify(routes)])
  return {
    data: result.data,
    rootValue: result.rootValue,
    isFetching,
    toolbar: (schema[routes[0]] || {}).toolbar,
    onClickSubmitButton: () => {},
    onClickCancelButton: () => {},
    onClickBackButton: () => {},
    ...provider
  }
}