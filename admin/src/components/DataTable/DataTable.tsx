import React from "react";
import "./DataTable.css";

const DataTable = ({ dataList, handleBlocked }: any) => {
  return (
    <>
      <div className="row mt-3 mx-auto">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>image</th>
                      {dataList[0]?.accountType === "PetOwner" && <th>name</th>}
                      {dataList[0]?.accountType === "Grooming" && (
                        <th>shop name</th>
                      )}
                      {dataList[0]?.accountType === "Clinic" && (
                        <th>clinic name</th>
                      )}

                      <th>mobile</th>
                      <th>email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataList.map((e: any, index: number) => (
                      <tr key={e._id}>
                        <td>{index + 1}</td>
                        <td
                          className="table_image mx-auto text-center"
                          style={{ width: "10px", height: "20px" }}
                        >
                          <img
                            className="img-fluid "
                            src={e.profileImage? e.profileImage: "https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-1024.png"}
                            alt=""
                          />
                        </td>
                        {e.accountType === "PetOwner" && <td>{e.username}</td>}

                        {e.accountType === "Grooming" && <td>{e.shopName}</td>}
                        {e.accountType === "Clinic" && <td>{e.clinicName}</td>}

                        <td>{e.mobile}</td>

                        <td>{e.email}</td>
                        <td>
                          <button
                            className="btn btn-dark"
                            onClick={() =>
                              handleBlocked(e._id, e.accountType, e.blocked)
                            }
                          >
                            {e.blocked ? "Unblock" : "Block"}
                          </button>
                        </td>
                      </tr>
                    ))}

                    {dataList.length === 0 && <h2>Empty list</h2>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataTable;
