"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Network } from "vis-network/standalone/esm/vis-network";
import { FaTruck, FaIndustry, FaNetworkWired } from "react-icons/fa";

type Edge = {
  from_node: string;
  to_node: string;
  capacity: number; // capacity as a float
  cost: number; // cost as a float
};

type FlowResult = {
  from: string;
  to: string;
  flow: number;
  capacity: number;
  cost: number;
  flow_cost: number;
};

export default function MCFTab() {
  const [nodes, setNodes] = useState<string>("s,a,b,t");
  const [edges, setEdges] = useState<Edge[]>([
    { from_node: "s", to_node: "a", capacity: 15.0, cost: 4.2 },
    { from_node: "s", to_node: "b", capacity: 8.0, cost: 2.3 },
    { from_node: "a", to_node: "b", capacity: 5.0, cost: 1.22 },
    { from_node: "a", to_node: "t", capacity: 10.0, cost: 2.5 },
    { from_node: "b", to_node: "t", capacity: 15.0, cost: 3.0 },
  ]);
  const [bValues, setBValues] = useState<number[]>([10.0, 0.0, 0.0, -10.0]);

  const [results, setResults] = useState<null | {
    status: string;
    total_cost?: number;
    flows?: FlowResult[];
    message?: string;
  }>(null);

  const handleAddEdge = () => {
    setEdges([
      ...edges,
      { from_node: "", to_node: "", capacity: 0.0, cost: 0.0 },
    ]);
  };

  const handleChangeEdge = (index: number, key: keyof Edge, value: any) => {
    const newEdges = [...edges];
    newEdges[index][key] =
      key === "capacity" || key === "cost" ? parseFloat(value) : value;
    setEdges(newEdges);
  };

  const handleBValueChange = (index: number, value: number) => {
    const newB = [...bValues];
    newB[index] = value;
    setBValues(newB);
  };

  const handleSubmit = async () => {
    const nodeList = nodes.split(",").map((n) => n.trim());
    try {
      const response = await axios.post("http://127.0.0.1:8000/solve_mcf", {
        nodes: nodeList,
        edges: edges,
        b_values: bValues,
      });
      setResults(response.data);
    } catch (err) {
      setResults({ status: "failed", message: "Request failed" });
    }
  };

  const getGraphData = () => {
    const nodeList = nodes.split(",").map((n) => n.trim());

    const graphNodes = nodeList.map((node, index) => {
      let color = "#007bff";

      if (node === "s") color = "yellow";
      else if (node === "t") color = "green";

      return {
        id: index,
        label: node,
        color: {
          background: color,
          border: "#333",
          highlight: {
            background: color,
            border: "#333",
          },
        },
        font: {
          color: "black",
          size: 16,
          face: "Arial",
        },
      };
    });

    const graphEdges = edges.map((edge, index) => ({
      from: nodeList.indexOf(edge.from_node),
      to: nodeList.indexOf(edge.to_node),
      label: `Flow: ${results?.flows?.[index]?.flow || 0}`,
      color: "gray",
      width: 2,
      font: { align: "middle" },
      length: 400,
    }));

    return { nodes: graphNodes, edges: graphEdges };
  };

  useEffect(() => {
    if (results?.status === "success") {
      const container = document.getElementById("network-container");
      const data = getGraphData();
      const options = {
        height: "500px",
        width: "100%",
        nodes: {
          shape: "dot",
          size: 25,
          font: {
            color: "red",
            size: 18,
          },
        },
        edges: {
          smooth: true,
          arrows: { to: { enabled: true, scaleFactor: 0.6 } },
        },
        interaction: {
          zoomView: false,
        },
        layout: {
          improvedLayout: true,
        },
      };
      new Network(container!, data, options);
    }
  }, [results]);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <p className="mb-4 text-lg text-white">
        The Minimum Cost Flow problem arises in many real-world scenarios:
      </p>

      <ul className="space-y-2 text-white">
        <li className="flex items-center space-x-2">
          <FaTruck className="text-yellow-400" />
          <span>Transportation networks</span>
        </li>
        <li className="flex items-center space-x-2">
          <FaIndustry className="text-blue-400" />
          <span>Supply chain logistics</span>
        </li>
        <li className="flex items-center space-x-2">
          <FaNetworkWired className="text-green-400" />
          <span>Telecommunication systems</span>
        </li>
      </ul>
      <br />

      <div className="grid grid-cols-1 gap-8 rounded-sm border-2 p-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-white">
            Nodes (comma-separated):
          </label>
          <input
            value={nodes}
            onChange={(e) => setNodes(e.target.value)}
            className="mb-4 w-full border px-3 py-1"
          />

          <h2 className="mb-2 text-xl font-semibold text-white">Edges</h2>
          {edges.map((edge, index) => (
            <div key={index} className="mb-2 grid grid-cols-4 gap-2">
              <input
                placeholder="From"
                value={edge.from_node}
                onChange={(e) =>
                  handleChangeEdge(index, "from_node", e.target.value)
                }
                className="border px-2 py-1"
              />
              <input
                placeholder="To"
                value={edge.to_node}
                onChange={(e) =>
                  handleChangeEdge(index, "to_node", e.target.value)
                }
                className="border px-2 py-1"
              />
              <input
                type="number"
                placeholder="Capacity"
                value={edge.capacity}
                onChange={(e) =>
                  handleChangeEdge(index, "capacity", e.target.value)
                }
                className="border px-2 py-1"
                step="any"
              />
              <input
                type="number"
                placeholder="Cost"
                value={edge.cost}
                onChange={(e) =>
                  handleChangeEdge(index, "cost", e.target.value)
                }
                className="border px-2 py-1"
                step="any"
              />
            </div>
          ))}
          <button
            onClick={handleAddEdge}
            className="mb-4 rounded bg-blue-500 px-4 py-1 text-white"
          >
            + Add Edge
          </button>

          <h2 className="mb-2 text-xl font-semibold text-white">
            Supply/Demand (b values)
          </h2>
          {nodes.split(",").map((node, index) => (
            <div key={index} className="mb-2">
              <label className="#f5f5f5f5">{node.trim()}:</label>
              <input
                type="number"
                value={bValues[index] ?? 0}
                onChange={(e) =>
                  handleBValueChange(index, parseFloat(e.target.value))
                }
                className="ml-2 border px-2 py-1"
                step="any" // Allow floating point input
              />
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="mt-4 rounded bg-green-600 px-6 py-2 text-white"
          >
            Solve
          </button>
        </div>

        {results && (
          <div className="text-white">
            <h3 className="mb-2 text-xl font-semibold">Results:</h3>

            {results.status === "success" ? (
              <>
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">
                      Total Cost
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      ${results.total_cost?.toFixed(2)}
                    </p>
                  </div>
                </div>

                <table className="mb-6 w-full border">
                  <thead>
                    <tr className="text-white">
                      <th>From</th>
                      <th>To</th>
                      <th>Flow</th>
                      <th>Capacity</th>
                      <th>Cost</th>
                      <th>Flow × Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.flows?.map((flow, i) => (
                      <tr key={i} className="border-t text-center">
                        <td>{flow.from}</td>
                        <td>{flow.to}</td>
                        <td>{flow.flow}</td>
                        <td>{flow.capacity}</td>
                        <td>{flow.cost}</td>
                        <td>{flow.flow_cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div>
                  <h3 className="mb-2 text-xl font-semibold">Visualization:</h3>
                  <div
                    id="network-container"
                    className="rounded-lg border bg-white"
                    style={{ height: "500px", width: "100%" }}
                  />
                </div>
              </>
            ) : (
              <p className="text-red-600">❌ {results.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
