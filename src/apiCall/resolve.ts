type resolve = {
    data: any;
    error: Error | null
}
export const  resolve = async (promise: Promise<any>) => {
  const resolved : resolve = {
    data: null,
    error: null
  };

  try {
    resolved.data = await promise;
  } catch(e) {
    resolved.error = e as Error;
  }

  return resolved;
}