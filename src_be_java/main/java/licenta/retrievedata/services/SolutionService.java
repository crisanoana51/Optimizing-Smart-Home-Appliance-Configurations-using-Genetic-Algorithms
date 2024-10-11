package licenta.retrievedata.services;

import licenta.retrievedata.entitites.Device;
import licenta.retrievedata.entitites.Solution;
import licenta.retrievedata.entitites.User;
import licenta.retrievedata.repositories.DeviceRepository;
import licenta.retrievedata.repositories.SolutionRepository;
import licenta.retrievedata.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SolutionService {

    @Autowired
    private SolutionRepository solutionRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private UserRepository userRepository;

    public void savePreferredSolution(Solution solution, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        solution.setUserId(user.getId());
        List<Device> devicesFromSolution = new ArrayList<>();
        for(Device device : solution.getDevices()){
                devicesFromSolution.add(device);
            }
        solution.setDevices(devicesFromSolution);
        solutionRepository.save(solution);

    }

    public List<Solution> getSolutionsByClientId(Long userId) {

        return solutionRepository.findByUserId(userId);

    }

    public List<DeviceCount> getDevicesSortedByOccurrences() {
        List<Solution> solutions = solutionRepository.findAll();
        Map<Device, Long> deviceCountMap = new HashMap<>();

        for (Solution solution : solutions) {
            for (Device device : solution.getDevices()) {
                deviceCountMap.put(device, deviceCountMap.getOrDefault(device, 0L) + 1);
            }
        }

        return deviceCountMap.entrySet().stream()
                .sorted(Map.Entry.<Device, Long>comparingByValue().reversed())
                .map(entry -> new DeviceCount(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    public static class DeviceCount {
        private Device device;
        private Long count;

        public DeviceCount(Device device, Long count) {
            this.device = device;
            this.count = count;
        }

        public Device getDevice() {
            return device;
        }

        public Long getCount() {
            return count;
        }
    }
}
